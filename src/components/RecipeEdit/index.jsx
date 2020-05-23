import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Alert, Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';

class RecipeEdit extends Component {

    emptyItem = {
        name: '',
        instructions: '',
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            errorMessage: null,
            isCreate: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        this.state.isCreate = this.props.match.params.id === 'new'; // are we editing or creating?
        if (!this.state.isCreate) {
            const response = await this.props.api.getById(this.props.match.params.id);
            const recipe = await response.json();
            this.setState({item: recipe});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item, isCreate} = this.state;

        let result = isCreate ? await this.props.api.create(item) : await this.props.api.update(item);

        if (!result.ok) {
            this.setState({errorMessage: `Failed to ${isCreate ? 'create' : 'update'} record: ${result.status} ${result.statusText}`})
        } else {
            this.setState({errorMessage: null});
            this.props.history.push('/recipes');
        }

    }

    render() {
        const {item, errorMessage, isCreate} = this.state;
        const title = <h2>{isCreate ? 'Add Recipe' : 'Edit Recipe'}</h2>;

        return (
            <div>
                {this.props.navbar}
                <Container style={{textAlign: 'left'}}>
                    {title}
                    {errorMessage ?
                        <Alert color="warning">
                            {errorMessage}
                        </Alert> : null
                    }
                    <Form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" id="name" value={item.name || ''}
                                       onChange={this.handleChange} autoComplete="name"/>
                            </FormGroup>
                            <FormGroup className="col-md-8 mb-3">
                                <Label for="instructions">Instructions</Label>
                                <Input type="text" name="instructions" id="instructions" value={item.instructions || ''}
                                       onChange={this.handleChange} autoComplete="instructions"/>
                            </FormGroup>
                        </div>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/recipes">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withRouter(RecipeEdit);