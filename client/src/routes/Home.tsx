import React from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import JobsCategory from '../components/JobsCategory'
import Companies from '../components/Companies'
import DashboardHome from '../components/DashboardHome'

export const  Home = () => {
  return (
    <>
    <Hero/>
    <DashboardHome/>
    <JobsCategory/>
    <Companies/>
    <Footer/>
    </>
  )
}




