import{fireEvent,render,screen}from'@testing-library/react'
import{describe,expect,it}from'vitest'
import App from'./App'

describe('relativity experience',()=>{
 it('uses reader-paced scenes and enters the experiment',()=>{
  render(<App/>)
  fireEvent.click(screen.getByRole('button',{name:/begin together/i}))
  expect(screen.getByText('Begin together.')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button',{name:'Next'}))
  expect(screen.getByText('Ride beside the clock.')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button',{name:/skip to experiment/i}))
  expect(screen.getByText('CHANGE THE VIEWPOINT')).toBeInTheDocument()
 })

 it('connects observer viewpoint, speed, and reunion time',()=>{
  render(<App/>)
  fireEvent.click(screen.getByRole('button',{name:/open the experiment/i}))
  expect(screen.getByText(/ship’s light path is 1.667× longer/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/at reunion earth clock reads 10.0 years and ship clock reads 6.00 years/i)).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button',{name:/ride with ship/i}))
  expect(screen.getByText(/nothing feels slowed/i)).toBeInTheDocument()
 })
})
