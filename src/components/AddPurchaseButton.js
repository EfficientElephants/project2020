import React from 'react'
import { Button } from 'react-bootstrap'

const AddPurchaseButton = ({onClick}) => (
  <Button className="Add-purchase" onClick={onClick}>Add Purchase</Button>
)

export default AddPurchaseButton