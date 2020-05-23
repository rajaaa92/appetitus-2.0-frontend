import React, { Component } from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Recipe from "../Recipe";

class RecipesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: [],
            isLoading: true,
            errorMessage: null
        };
        this.remove = this.remove.bind(this);
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        const response = await this.props.api.getAll();
        if (!response.ok) {
            this.setState({
                errorMessage: `Failed to load recipes: ${response.status} ${response.statusText}`,
                isLoading: false,
            });
        } else {
            const body = await response.json();
            const recipes = body._embedded.recipes;
            this.setState({
                recipes,
                isLoading: false,
                errorMessage: null
            });
        }
    }

    async remove(id) {
        const response = await this.props.api.delete(id);
        if (!response.ok) {
            this.setState({
                errorMessage: `Failed to delete recipe: ${response.status} ${response.statusText}`
            });
        } else {
            this.setState({
                recipes: this.state.recipes.filter(rec => rec.id !== id),
                errorMessage: null,
            });
        }
    }

    render() {
        const { recipes, isLoading, errorMessage } = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                {this.props.navbar}
                <div className="d-flex flex-row justify-content-between p-3">
                    <h3 className="recipes-title">Recipes</h3>
                    <Button color="success" tag={Link} to="/recipes/new">Add New</Button>
                </div>
                {errorMessage && (
                    <div className="d-flex flex-row justify-content-center">
                        <Alert color="warning" style={{ flex:1, maxWidth:'80%' }}>
                            {errorMessage}
                        </Alert>
                    </div>
                )}
                <div className="d-flex flex-row flex-container flex-wrap justify-content-center">
                    {recipes.map(recipe =>
                        <Recipe {...recipe} remove={this.remove} key={recipe.id}/>
                    )}
                    {!recipes || recipes.length === 0 ? <p>No recipes!</p> : null}
                </div>
            </div>
        );
    }
}

export default RecipesList;