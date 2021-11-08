import React, {Component} from 'react';
import Web3 from 'web3';

class Airdrop extends Component {
    // Airdrop to have timer that counts down
    // initialize countdown after our customer has staked >= 50 tokens
      
    constructor(props) {
        super(props) 
        this.state = {
            time: {},
            seconds: 20,
        };
        this.timer = 0;
        this.stateTime = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    countDown() {
        // count down 1s at a time
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        })

        // stop counting when we hit 0
        if (seconds == 0) {
            clearInterval(this.timer)
        }
    }

    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000)
        }
    }

    secondsToTime(secs) {
        let hours, minutes, seconds;
        hours = Math.floor(secs / (60 * 60))

        let devisor_for_minutes = secs % (60 * 60)
        minutes = Math.floor(devisor_for_minutes / 60)

        let devisor_for_seconds = devisor_for_minutes % 60
        seconds = Math.ceil(devisor_for_seconds)

        let obj = {
            'h' : hours,
            'm' : minutes,
            's': seconds
        }

        return obj
    }

    componentDidMount() {
        let remainingTime = this.secondsToTime(this.state.seconds)
        this.setState({time: remainingTime})
        this.airdropRewardTokens();
        
    }

    airdropRewardTokens() {
        let stakingB = this.props.stakingBalance
        if (stakingB >= Web3.utils.fromWei('50000000000000000000', 'ether')) {
            this.startTimer();
        }
    }


    render () {
        return (
            <div style={{color: 'black'}}>
                {this.state.time.m}:{this.state.time.s}
            </div>
        )
    }
}


export default Airdrop