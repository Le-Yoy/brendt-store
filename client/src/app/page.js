// src/app/page.js
import Header from '../components/layout/Header/Header';

export default function Home() {
  return (
    <main>
      <Header />
      <div className="content" style={{ padding: '2rem' }}>
        <h1>Welcome to BRENDT</h1>
        <p>Discover our premium shoe collection</p>
      </div>
    </main>
  );
}