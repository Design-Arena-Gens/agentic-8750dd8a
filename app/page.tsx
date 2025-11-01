export default function HomePage() {
  return (
    <main>
      <section className="card p-8 mb-8">
        <h2 className="text-xl font-bold mb-3">AI-powered medical training assistant</h2>
        <p className="text-white/80 leading-8">
          With Medyar you can interactively take history from virtual patients, request labs and imaging, provide differential diagnoses, and propose a treatment plan. The system evaluates your performance based on the case data and provides a concise teaching note at the end.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="/session" className="btn btn-primary">Start a case</a>
          <a href="#about" className="btn btn-secondary">Learn more</a>
        </div>
      </section>

      <section id="about" className="grid md:grid-cols-3 gap-4">
        <div className="card p-6">
          <h3 className="font-bold mb-2">Topic-based cases</h3>
          <p className="text-white/70 text-sm">Multiple sample cases per topic are stored and delivered randomly.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-2">Active interaction</h3>
          <p className="text-white/70 text-sm">Order labs and imaging and receive responses grounded in the actual case data.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-bold mb-2">Evaluation and teaching note</h3>
          <p className="text-white/70 text-sm">We analyze strengths and mistakes and provide a short tailored summary.</p>
        </div>
      </section>
    </main>
  )
}
