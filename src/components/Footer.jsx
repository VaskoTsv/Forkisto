import React from 'react';

export class Footer extends React.PureComponent {
    render() {
        return (
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        Build by <strong>Vasil Tsvetanov</strong> - find me on <a href="https://www.linkedin.com/in/vasil-tsvetanov-62b422bb/" target="_blank">LinkedIn</a>.
                        See more of my work on <a href="https://github.com/VaskoTsv?tab=repositories" target="_blank">GitHub</a>.
                    </p>
                </div>
            </footer>
        );
    }
}
