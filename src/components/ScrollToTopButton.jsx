import React from 'react';
import classNames from 'classnames';

export class ScrollToTopButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showButton: false,
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        document.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        const scrolledDistance = document.documentElement.scrollTop;

        this.setState({showButton: scrolledDistance > 300});
    }

    scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    render() {
        return <a className={classNames('scroll-to-top-button', {show: this.state.showButton})}
                  onClick={e => this.scrollToTop(e)}/>;
    }
}
