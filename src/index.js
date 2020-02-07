import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import axios from 'axios';
import './index.css';

class Hero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroName: this.props.match.params.name,
            heroId: Number.parseInt(this.props.match.params.id),
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({heroName: event.target.value});
    }

    updateHero(hero) {
        axios.put(`http://localhost:3004/heroes/${hero.id}`, hero)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(() => console.log("UPDATE hero with id ", hero.id));
    }

    render() {
        return (
            <div>
                <h3>{this.state.heroName} Details</h3>
                <div><span>id: </span>{this.state.heroId}</div>
                <div>
                    <label>name:
                        <input placeholder="name" value={this.state.heroName} onChange={this.handleChange}/>
                    </label>
                </div>
                <Link to={''} onClick={() => {
                    this.updateHero({"id": this.state.heroId, "name": this.state.heroName});
                    this.props.history.goBack()
                }}>Save</Link>
                <Link to={''} onClick={() => this.props.history.goBack()}>Back</Link>
            </div>
        );

    }
}

class HeroesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroes: [],
            selectedHero: null,
            newHero: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({newHero: event.target.value});
    }

    componentDidMount() {
        this.getHeroes();
    }

    componentWillMount() {
        this.getHeroes();
    }

    onSelect(hero) {
        this.setState({selectedHero: hero});
    }

    isActive(hero) {
        return ((hero === this.state.selectedHero) ? 'selected' : '');
    }

    render() {
        return (
            <div>
                <h3>My Heroes</h3>
                <div>
                    <label>Hero name:
                        <input type="text" value={this.state.newHero} onChange={this.handleChange}/>
                    </label>
                    <button onClick={() => this.addHero(this.state.newHero)}>Add</button>
                </div>
                <ul className="heroes">
                    {this.state.heroes.map(hero => {
                        return (
                            <li key={hero.id} className={this.isActive(hero)}>
                                <Link to={`/detail/${hero.id}/${hero.name}`}
                                      onClick={() => this.onSelect(hero)}>
                                    <span className="badge">{hero.id}</span>{hero.name}
                                </Link>
                                <button className="delete" onClick={() => this.deleteHero(hero.id)}>x</button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    getHeroes() {
        axios.get(`http://localhost:3004/heroes`)
            .then(res => this.setState({heroes: res.data}))
            .catch(err => console.log(err))
            .then(() => console.log('GET request executed'));
    }

    deleteHero(heroId) {
        axios.delete(`http://localhost:3004/heroes/${heroId}`)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(() => {
                console.log("DELETE hero with id ", heroId);
                this.getHeroes();
            });
    }

    addHero(newHero) {
        axios.post(`http://localhost:3004/heroes`, {"name": newHero})
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(() => {
                console.log("POST new hero");
                this.getHeroes();
            });
    }
}

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroes: [],
            selectedHero: {},
            searchHero: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({searchHero: event.target.value});
    }

    componentDidMount() {
        axios.get(`http://localhost:3004/heroes`)
            .then(res => this.setState({heroes: res.data}))
            .catch(err => console.log(err))
            .then(() => console.log('GET request executed'));
    }


    render() {
        let _heroes = this.state.heroes;
        let search = this.state.searchHero.trim().toLowerCase();

        if (search.length > 0) {
            _heroes = _heroes.filter(function (hero) {
                return hero.name.toLowerCase().match(search);
            });
        } else {
            _heroes = [];
        }
        return (
            <div>
                <h3>Top Heroes</h3>
                <div className="grid grid-pad">
                    {this.state.heroes.slice(1, 5).map(hero => {
                        return (
                            <Link to={`/detail/${hero.id}/${hero.name}`}>
                                <div className="module hero">
                                    <h4>{hero.name}</h4>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <input className="search" type="text" value={this.state.searchHero}
                       onChange={this.handleChange}
                       placeholder="Search"/>
                <ul className="search-result">
                    {_heroes.map((hero) =>
                        <li key={hero.id}>
                            <Link to={`/detail/${hero.id}/${hero.name}`}>
                                <span className="badge">{hero.name}</span>
                            </Link>
                        </li>
                    )
                    }
                </ul>
            </div>
        );
    }
}

class App extends React.Component {

    render() {
        return (
            <Router>
                <div>
                    <h1>Tour of Heroes</h1>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/heroes">Heroes</Link>
                    <Route path="/heroes" component={HeroesList}/>
                    <Route path="/detail/:id/:name" component={Hero}/>
                    <Route path="/dashboard" component={Dashboard}/>
                </div>
            </Router>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));