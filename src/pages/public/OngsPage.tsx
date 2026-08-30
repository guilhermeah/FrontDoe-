import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { Pagination } from '../../components/common/Pagination'
import { OngService } from '../../services/OngService'
import { Usuario } from '../../types/user.types'

const PAGE_SIZE = 9

export function OngsPage() {
  const [ongs, setOngs] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchOngs = (p: number, s: string) => {
    setIsLoading(true)
    OngService.listar(p, s)
      .then((result) => {
        setOngs(result.ongs)
        setTotalPages(result.totalPages)
        setTotalElements(result.totalElements)
      })
      .catch(() => {})
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
              ? ongs.map((ong) => (
                  <div key={ong.id} className="col-sm-6 col-lg-4">
                    <div
                      className="glass-card-dark p-4 h-100"
                      style={{ transition: 'all 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
                    >
                      <div className="d-flex align-items-center gap-3 mb-3">
                        {ong.imagemUrl ? (
                          <img src={ong.imagemUrl} alt={ong.nome} className="rounded-circle" style={{ width: 56, height: 56, objectFit: 'cover' }} />
                        ) : (
                          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', fontSize: '1.3rem', fontWeight: 700, color: 'white' }}>
                            {ong.nome.charAt(0)}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h6 className="text-white fw-bold mb-0 text-truncate">{ong.nome}</h6>
                          {ong.localizacao && (
                            <small style={{ color: 'var(--text-muted)' }}>
                              <i className="bi bi-geo-alt me-1" />{ong.localizacao}
                            </small>
                          )}
                        </div>
                      </div>
                      {ong.descricao && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                          {ong.descricao.slice(0, 120)}{ong.descricao.length > 120 ? '...' : ''}
                        </p>
                      )}
                      <Link
                        to={`/campanhas?ong=${ong.id}`}
                        className="btn btn-sm w-100 mt-2"
                        style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', color: '#6C63FF', borderRadius: 10 }}
                      >
                        Ver campanhas
                      </Link>
                    </div>
                  </div>
                ))
              : (
                <div className="col-12 text-center py-5">
                  <i className="bi bi-building fs-1" style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-muted)' }} className="mt-3">
                    {search ? `Nenhuma ONG encontrada para "${search}".` : 'Nenhuma ONG cadastrada.'}
                  </p>
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
