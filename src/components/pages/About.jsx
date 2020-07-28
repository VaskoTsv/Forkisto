import React from 'react';

export function About() {
    return (
        <div className="about-page-container">
            <section className="section">
                <div className="container">
                    <h1 className="title is-4">About the application: </h1>
                    <h2 className="subtitle is-6 mt-5">
                        This application is using spoonacular api. In it's core, the app is a small
                        tool for culinary enthusiast, making it easy to search and find new and
                        exciting recipes. In the future it is planned to be added authentication and
                        authorization + ability for each user to add recipes in his personally
                        created favourite recipes lists.
                    </h2>
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <h1 className="title is-5">About the tech stack used: </h1>
                    <h2 className="subtitle is-6 mt-4">
                        It is a single page application build with:
                        <div className="content">
                            <ul>
                                <li>React.js</li>
                                <li>React router - used for routing capabilities</li>
                                <li>Mobx - used for state management</li>
                                <li>Bulma - used for grid and ready styles</li>
                                <li>Sass - used for additional styling</li>
                                <li>Bundled with Parcel</li>
                            </ul>
                        </div>
                    </h2>
                </div>
            </section>
        </div>
    )
}
