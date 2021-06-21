import React from "react";
import { Navbar, NavbarBrand, Nav } from "react-bootstrap";

function HeadBar() {
  return (
    <Navbar bg="dark" variant="dark" sticky="top">
        <NavbarBrand>Math Is Cool</NavbarBrand>
        <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About Us</Nav.Link>
            <Nav.Link href="/information">Information</Nav.Link>
            <Nav.Link href="/resources">Resources</Nav.Link>
            <Nav.Link href="/competitions">Competitions</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
        </Nav>
    </Navbar>
  );
}

export default HeadBar;
