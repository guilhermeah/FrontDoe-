import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { CampaignCard } from '../../components/campaign/CampaignCard'
import { SkeletonCard } from '../../components/common/SkeletonLoader'
import { CampanhaService } from '../../services/CampanhaService'
import { Campanha } from '../../types/campaign.types'
import { formatCurrency } from '../../utils/formatters'

const howItWorks = [
  { step: '01', title: 'Cadastre-se', desc: 'Crie sua conta gratuitamente como doador ou ONG em menos de 2 minutos.' },
  { step: '02', title: 'Encontre causas', desc: 'Explore campanhas por categoria, localização ou nome da ONG.' },
  { step: '03', title: 'Doe e acompanhe', desc: 'Faça sua doação via PIX ou envie itens e veja o impacto gerado.' },
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
  const { isAuthenticated } = useAuth()
  const [featured, setFeatured] = useState<Campanha[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    CampanhaService.listar({ status: 'ATIVA' })
      .then((data) => setFeatured(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const heroCard = featured[0]

  return (
    <div className="page-shell">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: '5rem', background: 'var(--bg)' }}>
        <div className="container">
          <div className="row align-items-center g-5">

            {/* Left — copy */}
            <div className="col-lg-6 animate-fadeInUp">
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Plataforma de doações
              </p>
              <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text)' }}>
                Doe para causas que realmente importam
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 460 }}>
                Conectamos doadores a ONGs verificadas. Doe dinheiro, itens ou seu tempo — de forma simples e transparente.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/campanhas" className="btn btn-primary-custom px-5 py-3">
                  Explorar campanhas
                </Link>
                {!isAuthenticated && (
                  <Link to="/cadastro" className="btn px-5 py-3"
                    style={{ border: '1.5px solid var(--border)', color: 'var(--text)', background: 'transparent', borderRadius: 12 }}>
                    Cadastrar minha ONG
                  </Link>
                )}
              </div>
            </div>

            {/* Right — campanha real em destaque */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              {!isLoading && heroCard ? (
                <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
                  {/* Card principal */}
                  <div className="surface-card" style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={heroCard.imagemUrl || `https://picsum.photos/seed/${heroCard.id}/800/400`}
                        alt={heroCard.titulo}
                        style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${heroCard.id}/800/400` }}
                      />
                      {heroCard.ongNome && (
                        <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 10px' }}>
                          <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 600 }}>{heroCard.ongNome}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <p style={{ fontWeight: 700, color: 'var(--card-text)', marginBottom: '0.75rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                        {heroCard.titulo}
                      </p>
                      {/* Progress bar */}
                      <div style={{ background: 'var(--border)', borderRadius: 100, height: 6, marginBottom: '0.6rem', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          borderRadius: 100,
                          background: '#43D9A2',
                          width: `${Math.min(100, Math.round(((heroCard.valorArrecadado || 0) / heroCard.metaFinanceira) * 100))}%`,
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ color: '#43D9A2', fontWeight: 700, fontSize: '0.95rem' }}>
                          {formatCurrency(heroCard.valorArrecadado || 0)}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          meta {formatCurrency(heroCard.metaFinanceira)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Segundo card menor flutuando abaixo-direita */}
                  {featured[1] && (
                    <div className="surface-card d-flex align-items-center gap-3"
                      style={{ borderRadius: 14, padding: '0.9rem 1rem', position: 'absolute', bottom: -18, right: -24, maxWidth: 240, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                      <img
                        src={featured[1].imagemUrl || `https://picsum.photos/seed/${featured[1].id + 10}/80/80`}
                        alt=""
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${featured[1].id + 10}/80/80` }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--card-text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {featured[1].titulo}
                        </p>
                        <span style={{ color: '#43D9A2', fontWeight: 700, fontSize: '0.78rem' }}>
                          {formatCurrency(featured[1].valorArrecadado || 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Placeholder enquanto carrega */
                <div style={{ width: '100%', maxWidth: 400, height: 300, borderRadius: 20, background: 'var(--surface-raised)' }} />
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Featured campaigns ────────────────────────────────────── */}
      <section className="section-sm" style={{ background: 'var(--surface-raised)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="label-caps d-block mb-1">Campanhas ativas</span>
              <h2 className="fw-black mb-0">Apoie quem precisa agora</h2>
            </div>
            <Link to="/campanhas" className="btn btn-outline-secondary rounded-pill px-4 d-none d-md-inline-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
              Ver todas <i className="bi bi-arrow-right" />
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

          <div className="text-center mt-4 d-md-none">
            <Link to="/campanhas" className="btn btn-outline-secondary rounded-pill px-4">
              Ver todas as campanhas <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div className="text-center mb-4">
            <span className="label-caps d-block mb-2">Categorias</span>
            <h2 className="fw-black mb-0">Encontre sua causa</h2>
          </div>
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            {categories.map((cat) => (
              <Link key={cat.value} to={`/campanhas?categoria=${cat.value}`}
                className="text-decoration-none"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.45rem 1.1rem', borderRadius: 100,
                  border: '1.5px solid var(--border)',
                  color: 'var(--text)', fontSize: '0.85rem', fontWeight: 500,
                  background: 'var(--surface)', transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = cat.color
                  e.currentTarget.style.color = cat.color
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text)'
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, display: 'inline-block', flexShrink: 0 }} />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="section-sm" style={{ background: 'var(--surface-raised)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="label-caps d-block mb-2">Como funciona</span>
            <h2 className="fw-black mb-0">Três passos para causar impacto</h2>
          </div>
          <div className="row g-5">
            {howItWorks.map((step, i) => (
              <div key={i} className="col-md-4">
                <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {step.step}
                  </div>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>{step.title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="section-sm">
          <div className="container">
            <div className="text-center px-3 py-5 surface-card" style={{ borderRadius: 24, maxWidth: 640, margin: '0 auto' }}>
              <h2 className="fw-black mb-3">Pronto para fazer a diferença?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
                Crie sua conta gratuitamente e comece a apoiar causas hoje.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/cadastro" className="btn btn-primary-custom px-5 py-3">
                  Criar conta grátis
                </Link>
                <Link to="/campanhas" className="btn px-5 py-3 rounded-pill"
                  style={{ border: '1.5px solid var(--border)', color: 'var(--text)', background: 'transparent' }}>
                  Explorar campanhas
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
