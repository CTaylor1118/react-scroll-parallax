/* global IntersectionObserver */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

// With Observer creates a new IntersectionObserver
// that passes an `isInView` prop to wrapped components
// IntersectionObserver will require a polyfill

class Observed extends Component {
    state = {
        isInView: true, // initial state should be visible so that the scrollY is updated.
    };

    options = {
        root: null, // document.querySelector('#scrollArea')
        rootMargin: '0px',
        threshold: [0.1, 0.2, 0.4, 0.6, 0.8, 1.0], // 1.0 = 100% of the el is visible, can be an array of values. callback is invoke when each is true
    };

    componentDidMount() {
        this.createObserver();
        this.observe();
    }

    componentWillUnmount() {
        this.disconnectObserver();
    }

    mapRef = ref => {
        // NOTE: This ref will be the bounds of the
        // element and be provided by the withBounds HOC
        this.el = ref;
    };

    createObserver() {
        this.checkForObserver();

        this.observer = new IntersectionObserver(
            this.handleIntersection,
            this.options
        );
    }

    checkForObserver() {
        // NOTE: Error handling if the observer is not available
        // This should be provided by the user via a polyfill

        const hasObserver = 'IntersectionObserver' in window;
        if (!hasObserver) {
            throw new Error(
                'Must provide an IntersectionObserver polyfill for browsers that do not yet support the technology.'
            );
        }
    }

    disconnectObserver() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    observe() {
        const el = this.el;
        this.observer.observe(el);
    }

    handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            const isInView = entry.intersectionRatio > 0.01;

            this.setState(() => ({ isInView }));
        });
    };

    render() {
        const { isInView } = this.state;
        const { mapRef } = this;

        return this.props.children({ isInView, mapRef });
    }
}

export default Observed;