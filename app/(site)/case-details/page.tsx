import CaseDetails from '@/components/case-details/CaseDetails'
import CaseDetailsBanner from '@/components/case-details/CaseDetailsBanner'
import RelatedCases from '@/components/case-details/RelatedCases'
import React from 'react'

const page = () => {
  return (
    <>
        <CaseDetailsBanner />
        <CaseDetails />
        <RelatedCases />
    </>
  )
}

export default page
