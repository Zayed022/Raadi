import React from 'react'
import AboutBanner from '../components/AboutBanner'
import StatsCounter from '../components/StatsCounter'
import AboutIntroSection from '../components/AboutIntro'
import VideoSection from '../components/VideoSection'
import MissionSection from '../components/MissionSection'
import TopProducts from '../components/TopProducts'
import FeaturedProducts from '../components/FeaturedProducts'
import Testimonials from '../components/Testimonals'
import WhatWeOffer from '../components/WhatWeOffer'
import Footer from '../components/Footer'

function About() {
  return (
    <>
    <AboutBanner/>
    <StatsCounter/>
    <AboutIntroSection/>
    <WhatWeOffer/>
    <VideoSection/>
    <Testimonials/>
    <FeaturedProducts/>
    <TopProducts/>
    <MissionSection/>
    <Footer/>
    </>
  )
}

export default About
