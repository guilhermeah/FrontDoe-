import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { CampanhaService } from '../../services/CampanhaService'
import { Campanha } from '../../types/campaign.types'
import { useAuth } from '../../contexts/AuthContext'

const stats = [
  { icon: 'bi-heart-fill', value: '10K+', label: 'Doadores', color: '#FF6584' },
  { icon: 'bi-building', value: '500+', label: 'ONGs Parceiras', color: '#6C63FF' },
  { icon: 'bi-megaphone-fill', value: '2K+', label: 'Campanhas', color: '#43D9A2' },
  { icon: 'bi-currency-dollar', value: 'R$5M+', label: 'Arrecadados', color: '#FFD166' },
]

const howItWorks = [
  { step: '01', icon: 'bi-person-plus', title: 'Cadastre-se', desc: 'Crie sua conta gratuitamente como doador, ONG ou voluntário.' },
  { step: '02', icon: 'bi-search', title: 'Encontre causas', desc: 'Explore campanhas por categoria, localização ou impacto.' },
  { step: '03', icon: 'bi-heart-fill', title: 'Doe e impacte', desc: 'Faça sua doação e acompanhe o impacto em tempo real.' },
]

const categories = [
  { icon: 'bi-heart-pulse', label: 'Saúde', value: 'SAUDE', color: '#FF6584' },
  { icon: 'bi-book', label: 'Educação', value: 'EDUCACAO', color: '#6C63FF' },
  { icon: 'bi-tree', label: 'Meio Ambiente', value: 'MEIO_AMBIENTE', color: '#43D9A2' },
  { icon: 'bi-paw-fill', label: 'Animal', value: 'ANIMAL', color: '#FFD166' },
  { icon: 'bi-people', label: 'Social', value: 'SOCIAL', color: '#4ECDC4' },
  { icon: 'bi-palette', label: 'Cultura', value: 'CULTURA', color: '#A8E6CF' },
  { icon: 'bi-trophy', label: 'Esporte', value: 'ESPORTE', color: '#FF9F43' },
  { icon: 'bi-basket-fill', label: 'Alimentos', value: 'ALIMENTOS', color: '#6AB04C' },
]

export function HomePage() {
  const { user } = useAuth()
  const isOng = user?.role === 'ONG'
  const [featured, setFeatured] = useState<Campanha[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    CampanhaService.listar({ status: 'ATIVA' })
      .then((data) => setFeatured(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="page-shell">
      <Navbar />

      {/* Hero */}
      <section className="hero-section" style={{ paddingTop: '80px' }}>
        <div className="orb" style={{ width: 600, height: 600, background: '#6C63FF', top: -200, left: -200 }} />
        <div className="orb" style={{ width: 400, height: 400, background: '#FF6584', bottom: -100, right: -100, animationDelay: '3s' }} />
        <div className="orb" style={{ width: 300, height: 300, background: '#43D9A2', top: '50%', left: '60%', animationDelay: '1.5s' }} />

        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 animate-fadeInUp">
              <div className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-pill" style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#43D9A2', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#43D9A2', fontSize: '0.85rem', fontWeight: 600 }}>Plataforma de Doações #1 do Brasil</span>
              </div>

              <h1 className="display-4 fw-black lh-1 mb-4">
                Conectando{' '}
                <span className="gradient-text">corações</span>{' '}
                a causas que{' '}
                <span className="gradient-text">importam</span>
              </h1>

              <p className="lead mb-5" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                Junte-se a milhares de pessoas que estão transformando o mundo através de doações simples, seguras e transparentes.
              </p>

              <div className="d-flex flex-wrap gap-3">
                {!isOng && (
                  <Link to="/campanhas" className="btn btn-primary-custom px-5 py-3 fs-6">
                    <i className="bi bi-heart-fill me-2" />
                    Quero Doar
                  </Link>
                )}
                {!user && (
                  <Link to="/cadastro" className="btn btn-outline-light px-5 py-3 fs-6 rounded-pill">
                    <i className="bi bi-building me-2" />
                    Sou uma ONG
                  </Link>
                )}
              </div>

              <div className="d-flex flex-wrap gap-4 mt-5">
                {stats.map((s) => (
                  <div key={s.label} className="d-flex align-items-center gap-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36, background: `${s.color}20` }}>
                      <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <div className="fw-black" style={{ fontSize: '1.1rem', lineHeight: 1, color: 'var(--text)' }}>{s.value}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div className="position-relative" style={{ width: 440, height: 440 }}>
                <div
                  className="position-absolute rounded-circle"
                  style={{
                    width: '100%', height: '100%',
                    background: 'radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)',
                    animation: 'float 6s ease-in-out infinite',
                  }}
                />
                <div className="glass-card-dark p-4 position-absolute" style={{ top: '10%', left: '5%', width: 200, borderRadius: 16 }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rounded-circle" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #FF6584, #6C63FF)' }} />
                    <div>
                      <div className="text-white fw-bold" style={{ fontSize: '0.8rem' }}>Maria Silva</div>
                      <div style={{ color: '#43D9A2', fontSize: '0.7rem' }}>Doou R$150</div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>"Juntos fazemos a diferença!"</div>
                </div>

                <div className="glass-card-dark p-3 position-absolute" style={{ bottom: '15%', right: '5%', width: 180, borderRadius: 16 }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 6 }}>Meta atingida</div>
                  <div className="fw-black text-white" style={{ fontSize: '1.5rem' }}>87%</div>
                  <div className="progress progress-custom mt-2">
                    <div className="progress-bar" style={{ width: '87%' }} />
                  </div>
                </div>

                <div className="glass-card-dark p-3 position-absolute" style={{ top: '50%', right: '-5%', width: 140, borderRadius: 16, transform: 'translateY(-50%)' }}>
                  <i className="bi bi-heart-fill d-block mb-1" style={{ color: '#FF6584', fontSize: '1.5rem' }} />
                  <div className="text-white fw-bold" style={{ fontSize: '0.85rem' }}>+2.4K</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>doações hoje</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-sm">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black">Explore por <span className="gradient-text">categoria</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Encontre causas alinhadas aos seus valores</p>
          </div>
          <div className="row g-3 justify-content-center">
            {categories.map((cat) => (
              <div key={cat.value} className="col-6 col-md-4 col-lg-2">
                <Link
                  to={`/campanhas?categoria=${cat.value}`}
                  className="text-decoration-none"
                >
                  <div
                    className="glass-card-dark p-4 text-center"
                    style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.borderColor = cat.color }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.borderColor = '' }}
                  >
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: 52, height: 52, background: `${cat.color}20` }}>
                      <i className={`bi ${cat.icon} fs-4`} style={{ color: cat.color }} />
                    </div>
                    <div className="text-white fw-semibold" style={{ fontSize: '0.85rem' }}>{cat.label}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-sm">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-black">Como <span className="gradient-text">funciona</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Simples, rápido e seguro</p>
          </div>
          <div className="row g-4">
            {howItWorks.map((step, i) => (
              <div key={i} className="col-md-4">
                <div className="glass-card-dark p-4 h-100 text-center position-relative">
                  <div className="position-absolute" style={{ top: 16, right: 16, fontSize: '3rem', fontWeight: 900, color: 'rgba(108,99,255,0.08)', lineHeight: 1 }}>
                    {step.step}
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>
                    <i className={`bi ${step.icon} text-white fs-4`} />
                  </div>
                  <h5 className="text-white fw-bold">{step.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured campaigns */}
      <section className="section-sm">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-black mb-1">Campanhas em <span className="gradient-text">destaque</span></h2>
              <p style={{ color: 'var(--text-muted)' }} className="mb-0">Causas urgentes que precisam do seu apoio</p>
            </div>
            <Link to="/campanhas" className="btn btn-outline-secondary rounded-pill px-4">
              Ver todas <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>

          <div className="row g-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="col-md-4"><SkeletonCard /></div>
                ))
              : featured.length > 0
              ? featured.map((c) => (
                  <div key={c.id} className="col-md-4">
                    <CampaignCard campanha={c} />
                  </div>
                ))
              : (
                <div className="col-12 text-center py-5">
                  <i className="bi bi-megaphone fs-1" style={{ color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-muted)' }} className="mt-3">Nenhuma campanha ativa no momento.</p>
                </div>
              )
            }
          </div>
        </div>
      </section>

      {/* Impact section */}
      <section className="section-sm">
        <div className="container">
          <div className="glass-card-dark p-5" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))' }}>
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <h2 className="fw-black mb-3">Nosso <span className="gradient-text">impacto</span> em números</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  Cada doação conta. Juntos, já transformamos milhares de vidas através da solidariedade e da tecnologia.
                </p>
                <Link to="/sobre" className="btn btn-primary-custom mt-3 px-4">
                  Saiba mais <i className="bi bi-arrow-right ms-1" />
                </Link>
              </div>
              <div className="col-lg-6">
                <div className="row g-3">
                  {stats.map((s) => (
                    <div key={s.label} className="col-6">
                      <div className="text-center p-3 rounded-3" style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
                        <i className={`bi ${s.icon} d-block mb-2`} style={{ color: s.color, fontSize: '1.8rem' }} />
                        <div className="fw-black text-white" style={{ fontSize: '2rem', lineHeight: 1 }}>{s.value}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="container text-center">
          <div className="glass-card-dark p-5" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(67,217,162,0.1))' }}>
            <h2 className="fw-black display-5 mb-3">
              Pronto para fazer a <span className="gradient-text">diferença</span>?
            </h2>
            <p className="lead mb-4" style={{ color: 'var(--text-muted)' }}>
              Comece agora. É gratuito e leva apenas 2 minutos.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              {!user && (
                <Link to="/cadastro" className="btn btn-primary-custom px-5 py-3">
                  <i className="bi bi-rocket-takeoff me-2" />
                  Começar agora
                </Link>
              )}
              <Link to="/campanhas" className="btn btn-outline-light px-5 py-3 rounded-pill">
                Explorar campanhas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
