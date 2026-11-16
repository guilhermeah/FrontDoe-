import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { OngService } from '../../services/OngService'
import { Usuario } from '../../types/user.types'

export function OngsPage() {
  const [ongs, setOngs] = useState<Usuario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    OngService.listar()
      .then(setOngs)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = ongs.filter((o) =>
    !search || o.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-shell">
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div className="container py-5">

          <div className="text-center mb-5">
            <span className="label-caps d-block mb-2">Parceiros</span>
            <h1 className="fw-black display-5 mb-2">ONGs <span className="gradient-text">parceiras</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Organizações comprometidas com a transformação social</p>
          </div>

          <div className="mb-5 d-flex justify-content-center">
            <div className="input-group surface-card" style={{ maxWidth: 420, borderRadius: 12, overflow: 'hidden', border: '1.5px solid var(--border)' }}>
              <span className="input-group-text border-0" style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                <i className="bi bi-search" />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-transparent"
                placeholder="Buscar ONGs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ color: 'var(--text)', boxShadow: 'none' }}
              />
            </div>
          </div>

          <div className="row g-4">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="col-sm-6 col-lg-4"><SkeletonCard /></div>
                ))
              : filtered.length > 0
              ? filtered.map((ong) => (
                  <div key={ong.id} className="col-sm-6 col-lg-4">
                    <div
                      className="surface-card surface-card-hover p-4 h-100"
                      style={{ transition: 'all 0.2s' }}
                    >
                      <div className="d-flex align-items-center gap-3 mb-3">
                        {ong.imagemUrl ? (
                          <img src={ong.imagemUrl} alt={ong.nome} className="rounded-circle" style={{ width: 52, height: 52, objectFit: 'cover' }} />
                        ) : (
                          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                            {ong.nome.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h6 className="fw-bold mb-0" style={{ color: 'var(--card-text)' }}>{ong.nome}</h6>
                          {ong.localizacao && (
                            <small style={{ color: 'var(--text-muted)' }}>
                              <i className="bi bi-geo-alt me-1" />{ong.localizacao}
                            </small>
                          )}
                        </div>
                      </div>
                      {ong.descricao && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }} className="mb-3">
                          {ong.descricao.slice(0, 120)}{ong.descricao.length > 120 ? '...' : ''}
                        </p>
                      )}
                      <Link
                        to={`/campanhas?ong=${ong.id}`}
                        className="btn btn-primary-custom btn-sm w-100"
                        style={{ borderRadius: 10 }}
                      >
                        Ver campanhas
                      </Link>
                    </div>
                  </div>
                ))
              : (
                <div className="col-12 text-center py-5">
                  <i className="bi bi-building fs-1" style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-muted)' }} className="mt-3">Nenhuma ONG encontrada.</p>
                </div>
              )
            }
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
