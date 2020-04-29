import React, { Component } from 'react';
import { database, session } from '../config';

import Add from '@material-ui/icons/Add';
import Calendar from '@material-ui/icons/CalendarToday';
import CloseIcon from '@material-ui/icons/Close';
import Loading from '../assets/images/Infinity.gif';

class Permasalahan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problems: []
        }
    }

    closeModal = () => {
        const modal = document.getElementById("add-solusi");

        modal.classList.remove("fade-in");
        modal.classList.add("fade-out");

        setTimeout(function () {
            modal.style.display = "none"
        }, 500)
    }

    showModal = (idProblem, idDesa, title) => {
        const modal = document.getElementById("add-solusi");

        modal.style.display = "flex"
        modal.classList.remove("fade-out");
        modal.classList.add("fade-in");

        document.getElementById("id-permasalahan").value = idProblem;
        document.getElementById("id-desa").value = idDesa;
        document.getElementById("problem-title").value = title;
    }

    getProblems = () => {
        var problems = database.ref('problems');

        problems.on("value",
        (snapshot) => {
            this.setState({ problems: Object.entries(snapshot.val())})
        }, (err) => {
            console.log(err)
        })
    }

    createSolution = (e) => {
        e.preventDefault();

        const idDesa = this.refs.iddesa.value;
        const idProblem = this.refs.idproblem.value;
        const description = this.refs.description.value;
        const date = this.refs.date.value;
        const title = this.refs.title.value;

        if (!idProblem || !description || !date) {
            console.log('data tidak boleh kosong')
        }

        const newDate = new Date(date);
        const day = newDate.getUTCDate();
        const month = newDate.getUTCMonth() + 1;
        const year = newDate.getUTCFullYear();

        const datePlan = `${day} / ${month} / ${year}`;
        console.log(datePlan);

        database.ref('solutions/' + session + new Date().getTime()).set({
            idProblem: idProblem,
            idUser: session,
            idDesa: idDesa,
            description: description,
            date: datePlan,
            status: 1,
            title: title
        });

        // database.ref("problems/"+idProblem).update({
        //     "status" : 2
        // })
    }

    componentWillMount() {
        this.getProblems()
    }

    render() {
        let problems = this.state.problems;
        let items = [];

        for (let i = 0; i < problems.length; i++) {
            let detailProblem = problems[i][1];
            
            items.push(
            <div key={i}>
                <div className="img" style={{ backgroundImage: `url("${detailProblem.imgSource}")` }}></div>
                <div className="list-content">
                    <span className="bt bt-secondary">{detailProblem.address}</span>
                    <a href="/">{detailProblem.title}</a>
                    <div className="action">
                        <div className="date">
                            <Calendar style={{ color: 'rgb(144, 144, 144)', fontSize: '15px', margin: '0 8px -1.5px 0' }} />
                            <p>{detailProblem.date}</p>
                        </div>
                        <button className="bt bt-primary" onClick={() => this.showModal(problems[i][0], detailProblem.idUser, detailProblem.title)}><Add style={{ fontSize: '15px', margin: '0 8px 1px 0' }} /> Beri Solusi</button>
                    </div>
                </div>
            </div>
            )
        }

        if (items.length === 0) {
            items = <img className="loading" src={Loading} style={{ margin: '3em auto 3em' }} />
        }

        return (
            <div id="permasalahan-page">
                <div className="search">
                    <div className="search-title">
                        <h2>Temukan Permasalahan</h2>
                        <h4><span>144</span> hasil ditampilkan</h4>
                    </div>
                </div>
                <div className="permasalahan-list">
                    {items}
                </div>

                <div id="add-solusi" style={{ display: 'none' }}>
                    <div className="bg-fade"></div>
                    <div className="form">
                        <div><CloseIcon onClick={() => this.closeModal()} /></div>
                        <form onSubmit={this.createSolution}>
                            <input type="hidden" id="problem-title" ref="title" />
                            <input type="hidden" id="id-permasalahan" ref="idproblem" />
                            <input type="hidden" id="id-desa" ref="iddesa" />
                            <label>Deskripsi Solusi</label>
                            <textarea rows="5" cols="50" ref="description"></textarea>
                            <label>Waktu Pelaksanaan</label>
                            <input type="date" required="required" ref="date" />
                            <button className="bt bt-primary" type="submit">Kirim</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Permasalahan;