import { Navbar } from '../../components/layout/Navbar'
import { Footer } from '../../components/layout/Footer'
import { Link } from 'react-router-dom'

const values = [
  { icon: 'bi-shield-check', title: 'Transparência', desc: 'Cada centavo doado é rastreado e publicado em tempo real.', color: '#6C63FF' },
  { icon: 'bi-lock', title: 'Segurança', desc: 'Tecnologia de ponta para proteger seus dados e transações.', color: '#43D9A2' },
  { icon: 'bi-heart', title: 'Impacto', desc: 'Focamos em resultados concretos que transformam vidas.', color: '#FF6584' },
  { icon: 'bi-people', title: 'Comunidade', desc: 'Uma rede solidária unindo doadores, ONGs e voluntários.', color: '#FFD166' },
]

const team = [
  { name: 'Guilherme Henrique', role: 'CEO & Fundador' },
  { name: 'Lucas Henrique', role: 'CTO' },
  { name: 'Eduardo Zissimopulos', role: 'Diretor Social' },
  { name: 'Kauã Borda', role: 'Desenvolvedor' },
]

export function AboutPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div className="container py-5">

          {/* Header */}
          <div className="text-center mb-5">
            <span className="label-caps d-block mb-2">Sobre nós</span>
            <h1 className="fw-black display-4 mb-3">Sobre o <span className="gradient-text">Doe+</span></h1>
            <p className="lead" style={{ color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto' }}>
              Somos uma plataforma de doações que conecta pessoas solidárias a causas que realmente importam.
            </p>
          </div>

          {/* Mission */}
          <div className="section-dark-wrapper rounded-4 p-5 mb-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-6">
                <span className="label-caps d-block mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Nossa missão</span>
                <h2 className="fw-black mb-3" style={{ color: '#f1f5f9' }}>
                  Tecnologia a serviço da <span className="gradient-text">solidariedade</span>
                </h2>
                <p style={{ color: '#8892B0', lineHeight: 1.8 }}>
                  O Doe+ nasceu da crença de que a tecnologia pode aproximar a solidariedade humana. Nossa missão é tornar as doações mais acessíveis, transparentes e impactantes, conectando doadores comprometidos a ONGs sérias e campanhas verificadas.
                </p>
                <p style={{ color: '#8892B0', lineHeight: 1.8, marginTop: '1rem' }}>
                  Desde 2020, já facilitamos mais de R$5 milhões em doações, impactando diretamente mais de 100 mil pessoas em todo o Brasil.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="row g-3">
                  {values.map((v) => (
                    <div key={v.title} className="col-6">
                      <div className="p-3 rounded-3 h-100" style={{ background: `${v.color}12`, border: `1px solid ${v.color}28` }}>
                        <i className={`bi ${v.icon} fs-4 d-block mb-2`} style={{ color: v.color }} />
                        <div className="fw-bold" style={{ color: '#f1f5f9', fontSize: '0.9rem' }}>{v.title}</div>
                        <div style={{ color: '#8892B0', fontSize: '0.78rem', lineHeight: 1.5 }}>{v.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="text-center mb-5">
            <span className="label-caps d-block mb-2">Equipe</span>
            <h2 className="fw-black mb-5">As pessoas por trás do <span className="gradient-text">Doe+</span></h2>
            <div className="row g-4 justify-content-center">
              {team.map((t) => (
                <div key={t.name} className="col-sm-6 col-md-3">
                  <div className="surface-card p-4 text-center surface-card-hover">
                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #6C63FF, #FF6584)', fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>
                      {t.name.charAt(0)}
                    </div>
                    <h6 className="fw-bold mb-1" style={{ color: 'var(--card-text)' }}>{t.name}</h6>
                    <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="surface-card text-center p-5" style={{ borderRadius: 24 }}>
            <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #6C63FF, #FF6584)' }}>
              <i className="bi bi-heart-fill text-white fs-5" />
            </div>
            <h3 className="fw-black mb-3">Quer fazer parte desta <span className="gradient-text">história</span>?</h3>
            <p style={{ color: 'var(--text-muted)' }} className="mb-4">Junte-se a nós e ajude a transformar vidas.</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/cadastro" className="btn btn-primary-custom px-5 py-3">Começar agora</Link>
              <Link to="/contato" className="btn px-5 py-3 rounded-pill" style={{ border: '1.5px solid var(--border)', color: 'var(--text)', background: 'transparent' }}>Fale conosco</Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
