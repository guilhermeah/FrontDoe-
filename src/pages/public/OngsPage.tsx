import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { Pagination } from '../../components/common/Pagination'
import { OngService } from '../../services/OngService'
import { Usuario } from '../../types/user.types'
import { formatarEndereco, formatarEnderecoCurto, googleMapsUrl } from '../../utils/endereco'

const PAGE_SIZE = 9

export function OngsPage() {
  const [ongs, setOngs] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [erro, setErro] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchOngs = (p: number, s: string) => {
    setIsLoading(true)
    setErro(false)
    OngService.listar(p, s)
      .then((result) => {
        setOngs(result.ongs)
        setTotalPages(result.totalPages)
        setTotalElements(result.totalElements)
      })
      .catch(() => {
        // Antes o erro era engolido em silencio e a tela dizia "Nenhuma ONG
        // cadastrada" mesmo quando o problema era a API fora do ar.
        setOngs([])
        setTotalPages(1)
        setTotalElements(0)
        setErro(true)
      })
      .finally(() => setIsLoading(false))
  }

  // Busca inicial e ao mudar de página
  useEffect(() => {
    fetchOngs(page, search)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Debounce no campo de busca — reseta para página 0
  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(0)
      fetchOngs(0, value)
    }, 400)
  }

  const start = page * PAGE_SIZE + 1
  const end = Math.min((page + 1) * PAGE_SIZE, totalElements)

  return (
    <div className="page-shell">
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-black display-5 mb-2">ONGs <span className="gradient-text">parceiras</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Organizações comprometidas com a transformação social</p>
          </div>

          <div className="mb-4 d-flex justify-content-center">
            <div className="input-group" style={{ maxWidth: 400 }}>
              <span className="input-group-text" style={{ background: 'var(--input-group-bg)', border: '1px solid var(--input-group-border)', color: 'var(--text-muted)' }}>
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="Buscar ONGs..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ borderLeft: 'none' }}
              />
            </div>
          </div>

          {!isLoading && totalElements > 0 && (
            <p className="text-center mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Exibindo {start}–{end} de {totalElements} ONGs
            </p>
          )}

          <div className="row g-4">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="col-sm-6 col-lg-4"><SkeletonCard /></div>
                ))
              : ongs.length > 0
              ? ongs.map((ong) => {
                  const linkMapa = googleMapsUrl(ong)
                  const enderecoCurto = formatarEnderecoCurto(ong)
                  return (
                  <div key={ong.id} className="col-sm-6 col-lg-4">
                    <div
                      className="glass-card-dark p-4 h-100"
                      style={{ transition: 'all 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
                    >
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="position-relative flex-shrink-0 rounded-circle" style={{ width: 56, height: 56 }}>
                          <div className="rounded-circle d-flex align-items-center justify-content-center w-100 h-100" style={{ background: 'linear-gradient(135deg, #6C63FF, #FF6584)', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>
                            {ong.nome.charAt(0)}
                          </div>
                          {ong.imagemUrl && (
                            <img
                              src={ong.imagemUrl}
                              alt={ong.nome}
                              className="rounded-circle position-absolute top-0 start-0 w-100 h-100"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="text-white fw-bold mb-0 text-truncate">{ong.nome}</h6>
                          {(enderecoCurto || ong.localizacao) && (
                            <small style={{ color: 'var(--text-muted)' }}>
                              <i className="bi bi-geo-alt me-1" />{enderecoCurto || ong.localizacao}
                            </small>
                          )}
                        </div>
                      </div>

                      {linkMapa && (
                        <p
                          className="mb-3"
                          title={formatarEndereco(ong)}
                          style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}
                        >
                          {formatarEndereco(ong)}
                        </p>
                      )}

                      {ong.descricao && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          {ong.descricao.slice(0, 120)}{ong.descricao.length > 120 ? '...' : ''}
                        </p>
                      )}

                      <div className="d-flex gap-2 mt-2">
                        <Link
                          to={`/campanhas?ong=${ong.id}`}
                          className="btn btn-sm flex-grow-1"
                          style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF', borderRadius: 10 }}
                        >
                          Ver campanhas
                        </Link>
                        {linkMapa && (
                          <a
                            href={linkMapa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm flex-shrink-0"
                            title="Abrir endereço no Google Maps"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-muted)', borderRadius: 10 }}
                          >
                            <i className="bi bi-map me-1" />Mapa
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  )
                })
              : (
                <div className="col-12 text-center py-5">
                  <i className={`bi ${erro ? 'bi-wifi-off' : 'bi-building'} fs-1`} style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-muted)' }} className="mt-3">
                    {erro
                      ? 'Não foi possível carregar as ONGs. Verifique se a API está no ar.'
                      : search
                      ? `Nenhuma ONG encontrada para "${search}".`
                      : 'Nenhuma ONG cadastrada.'}
                  </p>
                  {erro && (
                    <button
                      type="button"
                      className="btn btn-sm rounded-pill"
                      onClick={() => fetchOngs(page, search)}
                      style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF' }}
                    >
                      <i className="bi bi-arrow-clockwise me-2" />Tentar novamente
                    </button>
                  )}
                </div>
              )
            }
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
