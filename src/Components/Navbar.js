import React from "react";
import { Navbar, NavbarBrand, Nav, NavDropdown } from "react-bootstrap";

function HeadBar() {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
        <NavbarBrand>Math Is Cool</NavbarBrand>
        <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="About Us" id="nav-dropdown">
              <NavDropdown.Item href="/about/history">History</NavDropdown.Item>
              <NavDropdown.Item href="/about/contacts">Contacts</NavDropdown.Item>
              <NavDropdown.Item href="/about/locations">Locations</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Information" id="nav-dropdown">
              <NavDropdown.Item href="/information/rules">Rules</NavDropdown.Item>
              <NavDropdown.Item href="/information/fees">Fees</NavDropdown.Item>
              <NavDropdown.Item href="/information/faq">FAQ</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Resources" id="nav-dropdown">
              <NavDropdown.Item href="/resources/rules">Rules</NavDropdown.Item>
              <NavDropdown.Item href="/resources/past-tests">Past Tests</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/competitions">Competitions</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
    </Navbar>
  );
}

export default HeadBar;
