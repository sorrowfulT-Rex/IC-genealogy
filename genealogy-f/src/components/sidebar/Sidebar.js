import Button from 'react-bootstrap/Button';
import {FilterForm, DropDown} from '../filter/Filter.js'
import React from "react";
import "./Sidebar.css"

export function Sidebar(props) {
  return (
    <div className='sidebar' onSubmit={props.onClick}>
      <div className='name-field'>
        <FilterForm title="Name :" placeholder="Name" name={props.name} type="text" onChange={props.nameChange}/>
      </div>
      <div className='date-from-field'>
        <FilterForm title="From :" placeholder="Year of Birth" type="text" onChange={props.yearFromChange}/>
      </div>
      <div className='date-to-field'>
        <FilterForm title="To :" placeholder="Year of Birth" type="text" onChange={props.yearToChange}/>
      </div>
      {/* <div className='family-field'> */}
        {/* <FilterForm title="Family Name" placeholder="e.g. Windsor" type="text" onChange={props.familyChange}/> */}
      {/* </div> */}
      <div className = 'family-field'><DropDown onChange={props.familyChange}/> </div>
      <Button className='apply-button' size='lg' type='primary' onClick={props.onClick}>
        Apply filters
      </Button>
    </div>
  );
}
