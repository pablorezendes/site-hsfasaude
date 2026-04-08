import { useEffect, useState } from 'react'

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <a 
          href="#" 
          className="btn btn-lg btn-primary btn-lg-square rounded-circle back-to-top"
          onClick={(e) => {
            e.preventDefault()
            scrollToTop()
          }}
          style={{ display: 'block' }}
        >
          <i className="fas fa-chevron-up"></i>
        </a>
      )}
    </>
  )
}

export default BackToTop

