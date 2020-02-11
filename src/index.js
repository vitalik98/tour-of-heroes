import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import axios from 'axios';
import './index.css';

class Hero extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            heroName: this.props.match.params.name,
            heroId: Number.parseInt(this.props.match.params.id),
            hero: {}
        };
        this.handleChange = this.handleChange.bind(this);
    }

    getHero(heroId) {
        axios.get(`http://localhost:3004/heroes/${heroId}`)
            .then(res => this.setState({hero: res.data}))
            .catch(err => console.log(err))
            .then(() => console.log("GET hero with id ", heroId));
    }

    componentDidMount() {
        this.getHero(this.state.heroId);
    }

    handleChange(event) {
        this.setState({heroName: event.target.value});
    }

    updateHero(hero) {
        hero.name = this.state.heroName;
        axios.put(`http://localhost:3004/heroes/${hero.id}`, hero)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(() => console.log("UPDATE hero with id ", hero.id));
    }

    render() {
        return (
            <div>
                <h3>{this.state.hero.name} Details</h3>
                <div><span>id: </span>{this.state.hero.id}</div>
                <ul className="detail">
                    <li>
                        <label>Name:
                            <input placeholder="name" value={this.state.heroName} onChange={this.handleChange}/>
                        </label>
                    </li>
                    <li>
                        <label>Strength: {this.state.hero.strength}</label>
                    </li>
                    <li>
                        <label>Agility: {this.state.hero.agility}</label>
                    </li>
                    <li>
                        <label>Mana: {this.state.hero.mana}</label>
                    </li>
                </ul>
                <Link to={''} onClick={() => {
                    this.updateHero(this.state.hero);
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
                <Link to={`/heroes/creation`}>
                    Create Hero
                </Link>
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
}

class HeroCreation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            statePoints: 10,
            strength: 0,
            agility: 0,
            mana: 0,
            heroName: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({heroName: event.target.value});
    }

    isDisabled() {
        return this.state.statePoints !== 0 || this.state.heroName === "";
    }

    createHero(hero) {
        axios.post(`http://localhost:3004/heroes`, hero)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            .then(() => {
                console.log("POST new hero");
            });
    }

    manageState(state, action) {
        switch (action) {
            case "add":
                switch (state) {
                    case "strength":
                        this.setState({strength: this.state.strength + 1});
                        this.setState({statePoints: this.state.statePoints - 1});
                        break;
                    case "agility":
                        this.setState({agility: this.state.agility + 1});
                        this.setState({statePoints: this.state.statePoints - 1});
                        break;
                    case "mana":
                        this.setState({mana: this.state.mana + 50});
                        this.setState({statePoints: this.state.statePoints - 1});
                        break;
                    default:
                        console.log("state", state);
                        break;
                }
                break;
            case "subtract":
                switch (state) {
                    case "strength":
                        this.setState({strength: this.state.strength - 1});
                        this.setState({statePoints: this.state.statePoints + 1});
                        break;
                    case "agility":
                        this.setState({agility: this.state.agility - 1});
                        this.setState({statePoints: this.state.statePoints + 1});
                        break;
                    case "mana":
                        this.setState({mana: this.state.mana - 50});
                        this.setState({statePoints: this.state.statePoints + 1});
                        break;
                    default:
                        console.log("state", state);
                        break;
                }
                break;
            default:
                console.log("state", state);
                break;
        }
    }

    render() {
        return (
            <div>
                <label>Hero name:
                    <input type="text" value={this.state.heroName} onChange={this.handleChange}/>
                </label>
                <div>
                    <span>Remaining state points: {this.state.statePoints}</span>
                </div>
                <ul className="creation">
                    <li>
                        <span>Strength: {this.state.strength}</span>
                        {this.state.statePoints > 0 &&
                        <button className="state" onClick={() => this.manageState("strength", "add")}>+</button>}
                        {this.state.strength > 0 &&
                        <button className="state" onClick={() => this.manageState("strength", "subtract")}>-</button>}
                    </li>
                    <li>
                        <span>Agility: {this.state.agility}</span>
                        {this.state.statePoints > 0 &&
                        <button className="state" onClick={() => this.manageState("agility", "add")}>+</button>}
                        {this.state.agility > 0 &&
                        <button className="state" onClick={() => this.manageState("agility", "subtract")}>-</button>}
                    </li>
                    <li>
                        <span>Mana: {this.state.mana}</span>
                        {this.state.statePoints > 0 &&
                        <button className="state" onClick={() => this.manageState("mana", "add")}>+</button>}
                        {this.state.mana > 0 &&
                        <button className="state" onClick={() => this.manageState("mana", "subtract")}>-</button>}
                    </li>
                </ul>
                <button disabled={this.isDisabled()} onClick={() => {
                    this.createHero(
                        {
                            "name": this.state.heroName,
                            "strength": this.state.strength,
                            "agility": this.state.agility,
                            "mana": this.state.mana
                        });
                    this.props.history.goBack()
                }}>
                    Create Hero
                </button>
            </div>
        );
    }
}

class Arena extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            heroes: [],
            firstHero: null,
            secondHero: null,
            firstHeroPicking: true
        };
    }

    componentDidMount() {
        this.getHeroes();
    }

    componentWillMount() {
        this.getHeroes();
    }

    getHeroes() {
        axios.get(`http://localhost:3004/heroes`)
            .then(res => this.setState({heroes: res.data}))
            .catch(err => console.log(err))
            .then(() => console.log('GET request executed'));
    }

    onHeroSelect(hero) {
        if (this.state.firstHeroPicking) {
            this.setState({firstHero: hero});
            this.setState({firstHeroPicking: !this.state.firstHeroPicking})
        } else {
            this.setState({secondHero: hero});
            this.setState({firstHeroPicking: !this.state.firstHeroPicking})
        }
    }

    isDisabled(hero) {
        return hero === this.state.firstHero || hero === this.state.secondHero;
    }

    pickOrder() {
        if (this.state.firstHeroPicking) {
            if (this.state.firstHero) {
                return (
                    <label>Pick first Hero or Fight</label>
                );
            } else {
                return (
                    <label>Pick first Hero</label>
                );
            }
        } else {
            if (this.state.secondHero) {
                return (
                    <label>Pick second Hero or Fight</label>
                );
            } else {
                return (
                    <label>Pick second Hero</label>
                );
            }
        }
    }

    //TODO fight
    heroFight(firstHero, secondHero) {
        let firstHeroHp = firstHero.strength * 100;
        let secondHeroHp = secondHero.strength * 100;
        let firstHeroAttackSpeed = firstHero.agility * 0.5;
        let secondHeroAttackSpeed = secondHero.agility * 0.5;
        let firstHeroDodgeChance = firstHero.agility*0.3;
        let secondHeroDodgeChance = secondHero.agility*0.3;
        while (firstHeroHp > 0 || secondHeroHp > 0) {
            if (firstHero.agility > secondHero.agility) {

            }
        }
    }

    render() {
        return (
            <div className="heroes-search">
                <div>
                    {this.pickOrder()}<br/>
                    <label>First hero: {this.state.firstHero && this.state.firstHero.name}</label><br/>
                    <label>Second hero: {this.state.secondHero && this.state.secondHero.name}</label>
                    <div className="grid grid-pad">
                        {this.state.heroes.map((hero) =>
                            <button key={hero.id} className="pick" disabled={this.isDisabled(hero)}
                                    onClick={() => this.onHeroSelect(hero)}>
                                <span className="badge">{hero.name}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
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
        this.getHeroes();
    }

    componentWillMount() {
        this.getHeroes();
    }

    getHeroes() {
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
                            <Link key={hero.id} to={`/detail/${hero.id}/${hero.name}`}>
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
                    )}
                </ul>
            </div>
        );
    }
}

class App extends React.Component {

    render() {
        return (
            <Router>
                <h1>Tour of Heroes</h1>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/heroes">Heroes</Link>
                <Link to="/arena">Arena</Link>
                <Switch>
                    <Route path="/heroes/creation" component={HeroCreation}/>
                    <Route path="/heroes" component={HeroesList}/>
                    <Route path="/detail/:id/:name" component={Hero}/>
                    <Route path="/dashboard" component={Dashboard}/>
                    <Route path="/arena" component={Arena}/>
                </Switch>
            </Router>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));