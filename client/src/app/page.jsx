'use client';

import React from 'react';
import Hero from '../components/home/Hero/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import WhyBrendt from '../components/home/WhyBrendt';
import CategoryGrid from '../components/home/CategoryGrid';
import PromoFeatures from '../components/home/PromoFeatures';

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <FeaturedProducts />
      <WhyBrendt />
      <CategoryGrid />
      <PromoFeatures />
      <div style={{ height: '100px' }}></div>
    </div>
  );
}