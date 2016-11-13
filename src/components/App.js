//importing react
import React from 'react';
//importing the header component
import Header from './Header';
//importing the order component
import Order from './Order';
//importing the inventory component
import Inventory from './Inventory';
//importing the sample fishes JSON
import sampleFishes from '../sample-fishes'
//importing the fish component
import Fish from './Fish'

import base from '../base'

//creating the App component
class App extends React.Component{
	//setting up the constructor
	constructor(){
		//calling super to bind this to the App component
		super();
		//binding the addfish methos to the App component
		this.addFish = this.addFish.bind(this)
		this.removeFish = this.removeFish.bind(this)
		//binding the loadsamples method to the
		this.loadSamples = this.loadSamples.bind(this)
		this.addToOrder = this.addToOrder.bind(this)
		this.removeFromOrder = this.removeFromOrder.bind(this)
		this.updateFish = this.updateFish.bind(this)
		this.state = {
			fishes: {},
			order: {}
		}
	}

	componentWillMount(){
		this.ref = base.syncState(`${this.props.params.storeId}/fish`, {
			context: this,
			state: 'fishes'
		})

		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)

		if(localStorageRef){
			this.setState({
				order: JSON.parse(localStorageRef)
			})
		}
	}

	componentWillUnmount(){
		base.removeBinding(this.ref)
	}

	componentWillUpdate(nextProps, nextState){
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
	}

	addFish(fish ){
		const fishes = {...this.state.fishes}
		const timestamp = Date.now()
		fishes[`fish-${timestamp}`] = fish
		this.setState({fishes})
	}

	removeFish(key){
		const fishes = {...this.state.fishes}
		fishes[key] = null
		this.setState({ fishes })
	}

	updateFish(key, updatedFish){
		const fishes = {...this.state.fishes}
		fishes[key] = updatedFish
		this.setState({ fishes })
	}

	loadSamples(){
		this.setState({
			fishes: sampleFishes
		})
	}

	addToOrder(key){
		const order = {...this.state.order}
		order[key] = order[key] + 1 || 1
		this.setState({ order })
	}

	removeFromOrder(key){
		const order = {...this.state.order}
		delete order[key]
		this.setState({ order })
	}

	render(){
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fishes">
						{
							Object.keys(this.state.fishes)
							.map(key => <Fish key={key} index={key} addToOrder={this.addToOrder} details={this.state.fishes[key]} />)

						}
					</ul>
				</div>
				<Order 
					fishes={this.state.fishes} 
					order={this.state.order}
					removeFromOrder={this.removeFromOrder}
					params={this.props.params}
				/>
				<Inventory 
					addFish={this.addFish}
					removeFish={this.removeFish} 
					loadSamples={this.loadSamples}
					fishes={this.state.fishes}
					updateFish={this.updateFish}
					storeId={this.props.params.storeId} 
				/>
			</div>
		)
	}
}

App.propTypes = {
	params: React.PropTypes.object.isRequired
}



export default App;