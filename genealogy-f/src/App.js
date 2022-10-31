import {FamilyTree} from "./components/family-tree/FamilyTree";
import _ from "lodash";
import {Sidebar} from './components/sidebar/Sidebar.js';
import {Requests} from './requests';
import React from "react";
import * as go from 'gojs';
import {ReactDiagram} from 'gojs-react';
import './App.css';
import {Topbar} from './components/topbar/Topbar.js'
import {NameSearch} from './components/name-search/NameSearch.js'
import {Adapter} from './components/visualisation-adapter/Adapter';

import { GenogramTree } from "./GenogramTree";
import {transform} from "./GenogramTree";
import { Form } from "react-bootstrap";
import ClipLoader from 'react-spinners/ClipLoader';
import {exportComponentAsPNG} from 'react-component-export-image';
import {CustomUpload} from "./components/custom-upload/CustomUpload";

import {ResultPage} from "./components/result-page/ResultPage.js"
// import ClipLoader from 'react-spinners/ClipLoader';

import {ResultPage} from "./components/result-page/ResultPage.js"
// import ClipLoader from 'react-spinners/ClipLoader';
import {exportComponentAsPNG} from 'react-component-export-image';

// COMMENT THIS IN FOR FULL FLOW TEST
class App extends React.Component {
    componentDidMount(){
        document.title = "Ancesta - Genealogy Project"
    }

    render() {
        return (
            <NameForm />
        );
    }
}

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialName: '',
            searchJsons: [],
            chosenId: '',
            relationsJson: {},
            fromYear: '',
            toYear: '',
            transformedArr: [],
            isLoading: false,
        };
        this.requests = new Requests();

        this.handleChangeInitialName = this.handleChangeInitialName.bind(this);
        this.handleChangeChosenId = this.handleChangeChosenId.bind(this);
        this.handleChangeFrom = this.handleChangeFrom.bind(this);
        this.handleChangeTo = this.handleChangeTo.bind(this);

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.handleRelationsSubmit = this.handleRelationsSubmit.bind(this);
        this.handleCustomUpload = this.handleCustomUpload.bind(this);
    }

    handleChangeInitialName(event) {
        this.setState({initialName: event.target.value});
    }

    handleChangeChosenId(id) {
        this.setState({chosenId: id});
    }

    handleChangeFrom(event) {
        const val = event.target.value;
        this.setState({fromYear: val});
    }

    handleChangeTo(event) {
        const val = event.target.value;
        this.setState({toYear: val});
    }

    render() {
        return (
            <div className='App'>
                {
                    _.isEmpty(this.state.searchJsons)
                    && <NameSearch
                        onChange={this.handleChangeInitialName}
                        onClick={this.handleSearchSubmit}
                    />
                }
                {
                    (
                        !_.isEmpty(this.state.searchJsons) ||
                            !_.isEmpty(this.state.relationsJson)
                    ) &&
                         <Sidebar
                            name={this.state.initialName}
                            nameChange={this.handleChangeInitialName}
                            yearFromChange={this.handleChangeFrom}
                            yearToChange={this.handleChangeTo}
                            onClick={this.handleSearchSubmit}
                        />
                }
                <div className='tree-box'>
                    {
                        !_.isEmpty(this.state.relationsJson)
                            // TODO - entry point for genogram tree
                            ?
                            <GenogramTree
                                rawJson={this.state.relationsJson}
                                from={this.state.fromYear}
                                to={this.state.toYear}
                            />
                            // <Adapter data={this.state.relationsJson} />

                            : ''
                    }
                </div>
                {
                    !_.isEmpty(this.state.searchJsons) && _.isEmpty(this.state.relationsJson)
                        ? <ResultPage
                            state={this.state}
                            onChange={this.handleChangeChosenId}
                            onSubmit={this.handleRelationsSubmit}
                        />
                        : ''
                }
                {
                    this.state.isLoading
                        && <ClipLoader
                            color='#0000ff'
                            cssOverride={{
                                display: 'block',
                                margin: '0 auto',
                            }}
                            size={75}
                        />
                }
                <CustomUpload onSubmit={this.handleCustomUpload} />
            </div>
        );
    }

    async handleSearchSubmit(event) {
        if (this.state.initialName === '') {
            alert("Please enter a name!");
            return;
        }
        event.preventDefault();
        this.setState({
            isLoading: true,
        });
        if (Object.keys(this.state.relationsJson).length !== 0) {
            console.log("Handle Filter: "+ Object.values(this.state.relationsJson));
            let from = this.state.fromYear;
            let to = this.state.toYear;
            this.setState({
                fromYear: from,
                toYear: to,
            });
            this.render();
            return;
        }
        await this.requests.search(this.state.initialName).then(r => {
            let from = this.state.fromYear;
            let to = this.state.toYear;

            if (Object.values(r).length === 0) {
                alert("Person not found!");
                this.setState({
                    relationsJson: {},
                    isLoading: false,
                });
                return;
            }

            r = Object.values(r).filter(function (v) {
                let birth = v.dateOfBirth;
                if (birth == null) return true;
                if (from !== '' && to !== '') {
                    return (parseInt(birth.substring(0, 4)) >= parseInt(from) && parseInt(birth.substring(0, 4)) <= parseInt(to))
                } else if (from !== '') {
                    return parseInt(birth.substring(0, 4)) >= parseInt(from);
                } else if (to !== '') {
                    return parseInt(birth.substring(0, 4)) <= parseInt(to);
                }
                return true;
            });

            this.setState({
                searchJsons: r,
                chosenId: r[0].id,
                fromYear : from,
                toYear: to,
                relationsJson: {},
                isLoading: false,
            });
        });

    }

    handleRelationsSubmit(event) {
        if (this.state.chosenId === '') {
            alert("Haven't selected a person!");
            return;
        }
        event.preventDefault();
        this.setState({
            isLoading: true,
        });
        this.requests.relations({id: this.state.chosenId}).then(r => {
            if (Object.values(r)[1].length === 0) {
                this.setState({
                    relationsJson: {},
                });
                alert("No relationship found!")
                return;
            }
            this.setState({
                relationsJson: r,
                isLoading: false,
            });
        });
    }

    handleCustomUpload(data) {
        this.setState({
            relationsJson: data,
        });
    }

}

export default App;