import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Alert } from '../../components/common/Alert'
import { ImageUpload } from '../../components/common/ImageUpload'
import { useAuth } from '../../contexts/AuthContext'
import { UsuarioService } from '../../services/UsuarioService'
import { CepService } from '../../services/CepService'
import { UsuarioUpdateRequest } from '../../types/user.types'
import { formatarCep, googleMapsUrl, somenteDigitosCep } from '../../utils/endereco'

export function OngProfilePage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingFoto, setIsUploadingFoto] = useState(false)
  const [isBuscandoCep, setIsBuscandoCep] = useState(false)
  const [cepErro, setCepErro] = useState<string | null>(null)
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null)

  const { register, handleSubmit, reset, setValue, watch } = useForm<UsuarioUpdateRequest>()

  const enderecoAtual = {
    cep: watch('cep'),
    endereco: watch('endereco'),
    numero: watch('numero'),
    complemento: watch('complemento'),
    bairro: watch('bairro'),
    cidade: watch('cidade'),
    estado: watch('estado'),
  }
  const linkMapa = googleMapsUrl(enderecoAtual)

  useEffect(() => {
    if (!user) return
    UsuarioService.buscarPorId(user.id, user.role)
      .then((data) => {
        updateUser({ imagemUrl: data.imagemUrl, nome: data.nome })
        reset({
          nome: data.nome,
          razaoSocial: data.razaoSocial,
          telefone: data.telefone,
          descricao: data.descricao,
          localizacao: data.localizacao,
          site: data.site,
          chavePix: data.chavePix,
          cep: formatarCep(data.cep),
          endereco: data.endereco,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
        })
      })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.role])

  const handleFotoUpload = async (file: File) => {
    if (!user) return
    setIsUploadingFoto(true)
    try {
      const updated = await UsuarioService.uploadFotoOng(user.id, file)
      updateUser({ imagemUrl: updated.imagemUrl })
      setAlert({ type: 'success', msg: 'Foto atualizada com sucesso!' })
    } catch {
      setAlert({ type: 'danger', msg: 'Erro ao enviar foto. Verifique o formato e o tamanho (máx. 5MB).' })
    } finally {
      setIsUploadingFoto(false)
    }
  }

  /** Preenche o endereco a partir do CEP digitado (ViaCEP). */
  const handleBuscarCep = async () => {
    const digitos = somenteDigitosCep(watch('cep') || '')
    setCepErro(null)

    if (digitos.length !== 8) {
      setCepErro('Digite os 8 numeros do CEP.')
      return
    }

    setIsBuscandoCep(true)
    try {
      const endereco = await CepService.buscar(digitos)
      setValue('cep', formatarCep(endereco.cep))
      setValue('endereco', endereco.endereco)
      setValue('bairro', endereco.bairro)
      setValue('cidade', endereco.cidade)
      setValue('estado', endereco.estado)
      // O complemento do ViaCEP costuma ser generico ("de 1 a 99"),
      // entao so preenche quando a ONG ainda nao escreveu o dela.
      if (endereco.complemento && !watch('complemento')) {
        setValue('complemento', endereco.complemento)
      }
      // Mantem o campo antigo de localizacao coerente com o endereco novo.
      if (endereco.cidade && endereco.estado) {
        setValue('localizacao', `${endereco.cidade}, ${endereco.estado}`)
      }
    } catch (err) {
      setCepErro(err instanceof Error ? err.message : 'Nao foi possivel buscar o CEP.')
    } finally {
      setIsBuscandoCep(false)
    }
  }

  const onSubmit = async (data: UsuarioUpdateRequest) => {
    if (!user) return
    setIsLoading(true)
    try {
      await UsuarioService.atualizar(
        user.id,
        { ...data, cep: somenteDigitosCep(data.cep || '') },
        user.role,
      )
      updateUser({ nome: data.nome })
      setAlert({ type: 'success', msg: 'Perfil atualizado com sucesso!' })
    } catch {
      setAlert({ type: 'danger', msg: 'Erro ao atualizar perfil.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout title="Meu Perfil">
      <div className="mb-4 d-flex align-items-start justify-content-between gap-3 flex-wrap">
        <div>
          <h4 className="fw-black mb-1" style={{ color: 'var(--text)' }}>Perfil da ONG</h4>
          <p className="mb-0" style={{ color: 'var(--text-muted)' }}>Mantenha suas informações atualizadas</p>
        </div>
        <Link to="/" className="btn btn-sm rounded-pill" style={{ background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <i className="bi bi-house-fill me-2" />Home
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="glass-card-dark p-4 p-md-5">
            {alert && <Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} />}

            <div className="text-center mb-5">
              <ImageUpload
                currentUrl={user?.imagemUrl}
                onFileSelect={handleFotoUpload}
                isUploading={isUploadingFoto}
                shape="circle"
                label="Clique para alterar a logo"
              />
              <h5 className="text-white fw-bold mt-2">{user?.nome}</h5>
              <span className="badge" style={{ background: 'rgba(108,99,255,0.2)', color: '#6C63FF', border: '1px solid rgba(108,99,255,0.3)' }}>
                {user?.email}
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Nome da ONG</label>
                  <input {...register('nome')} className="form-control form-control-custom" placeholder="Nome fantasia" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Razão Social <span className="text-danger">*</span></label>
                  <input {...register('razaoSocial')} className="form-control form-control-custom" placeholder="Razão social" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Telefone</label>
                  <input {...register('telefone')} className="form-control form-control-custom" placeholder="(00) 00000-0000" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Localização</label>
                  <input {...register('localizacao')} className="form-control form-control-custom" placeholder="Cidade, Estado" />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Site</label>
                  <input {...register('site')} className="form-control form-control-custom" placeholder="https://..." />
                </div>
                <div className="col-12">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.25)' }}>
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <i className="bi bi-geo-alt-fill" style={{ color: '#6C63FF' }} />
                      Endereço da ONG
                    </label>

                    <div className="row g-3">
                      <div className="col-md-5">
                        <label className="form-label fw-semibold small">CEP</label>
                        <div className="input-group">
                          <input
                            {...register('cep')}
                            className="form-control form-control-custom"
                            placeholder="00000-000"
                            inputMode="numeric"
                            maxLength={9}
                            onChange={(e) => {
                              setCepErro(null)
                              setValue('cep', formatarCep(e.target.value))
                            }}
                            onBlur={() => {
                              if (somenteDigitosCep(watch('cep') || '').length === 8) handleBuscarCep()
                            }}
                          />
                          <button
                            type="button"
                            className="btn"
                            onClick={handleBuscarCep}
                            disabled={isBuscandoCep}
                            style={{ background: 'rgba(108,99,255,0.18)', border: '1px solid rgba(108,99,255,0.35)', color: '#6C63FF', fontWeight: 600 }}
                          >
                            {isBuscandoCep
                              ? <span className="spinner-border spinner-border-sm" />
                              : <><i className="bi bi-search me-1" />Buscar</>}
                          </button>
                        </div>
                        {cepErro && <div className="small mt-1 text-danger">{cepErro}</div>}
                      </div>

                      <div className="col-md-7">
                        <label className="form-label fw-semibold small">Logradouro</label>
                        <input {...register('endereco')} className="form-control form-control-custom" placeholder="Rua, avenida..." />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label fw-semibold small">Número</label>
                        <input {...register('numero')} className="form-control form-control-custom" placeholder="123" />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label fw-semibold small">Complemento</label>
                        <input {...register('complemento')} className="form-control form-control-custom" placeholder="Sala, bloco..." />
                      </div>

                      <div className="col-md-5">
                        <label className="form-label fw-semibold small">Bairro</label>
                        <input {...register('bairro')} className="form-control form-control-custom" placeholder="Bairro" />
                      </div>

                      <div className="col-md-9">
                        <label className="form-label fw-semibold small">Cidade</label>
                        <input {...register('cidade')} className="form-control form-control-custom" placeholder="Cidade" />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label fw-semibold small">UF</label>
                        <input {...register('estado')} className="form-control form-control-custom" placeholder="SP" maxLength={2} />
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mt-3">
                      <div className="small" style={{ color: 'var(--text-muted)' }}>
                        Digite o CEP e clique em <strong>Buscar</strong> para preencher o endereço automaticamente.
                        Ele aparece no seu card na página de ONGs.
                      </div>
                      {linkMapa && (
                        <a
                          href={linkMapa}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm rounded-pill flex-shrink-0"
                          style={{ background: 'rgba(108,99,255,0.18)', border: '1px solid rgba(108,99,255,0.35)', color: '#6C63FF', fontWeight: 600 }}
                        >
                          <i className="bi bi-map me-2" />Ver no mapa
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="p-3 rounded-3" style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.25)' }}>
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <i className="bi bi-qr-code" style={{ color: '#6C63FF' }} />
                      Chave PIX para receber doações
                    </label>
                    <input
                      {...register('chavePix')}
                      className="form-control form-control-custom"
                      placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                    />
                    <div className="small mt-2" style={{ color: 'var(--text-muted)' }}>
                      É esta chave que aparece no QR Code gerado quando alguém faz uma doação financeira
                      para suas campanhas. Sem ela, o pagamento cai na chave padrão da plataforma.
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Descrição</label>
                  <textarea {...register('descricao')} className="form-control form-control-custom" rows={4} placeholder="Descreva sua ONG, missão e atuação..." />
                </div>
                <div className="col-12 pt-2">
                  <button type="submit" className="btn btn-primary-custom px-5 py-2" disabled={isLoading}>
                    {isLoading ? <><span className="spinner-border spinner-border-sm me-2" />Salvando...</> : <><i className="bi bi-check-lg me-2" />Salvar Perfil</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
