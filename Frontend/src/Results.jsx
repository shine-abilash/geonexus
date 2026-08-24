function Results(){
  return (
    <div className="app-container">
      <section className="panel center">
        <h2>Analysis Result</h2>
        <div style={{display:'flex',gap:16}}>
          <div style={{flex:1}}>
            <img className="result-image" src="/src/assets/sample.jpg" alt="result" />
          </div>
          <aside style={{width:260}} className="panel" >
            <h4>AI Answer</h4>
            <p>I found 12 buildings in the image. Most are residential structures with different roof types.</p>
            <div style={{marginTop:12}}><strong>Model Used:</strong> Grounding DINO</div>
            <div style={{marginTop:8}}><strong>Task:</strong> Object Detection</div>
            <div style={{marginTop:12}}><span className="badge">92%</span> Confidence Score</div>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default Results
