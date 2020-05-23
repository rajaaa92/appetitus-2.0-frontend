import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import '../index.css';

class Home extends Component {
  render() {
    if (this.props.authenticated === null) {
        return <p>Loading...</p>;
    }
    return (
        <div className="app">
            {this.props.navbar}
            <Container fluid>
                { this.props.authenticated ?
                    <div>
                        <p>Welcome, {this.props.user.name}</p>
                        <Button color="secondary">
                            <Link className="app-link" to="/recipes">Manage Recipes</Link>
                        </Button>
                    </div> :
                    <div>
                        <p>Please log in to manage recipes.</p>
                        <Button color="secondary" disabled={true}>Manage Recipes</Button>
                    </div>
                }
            </Container>
        </div>
    );
  }
}

export default Home;