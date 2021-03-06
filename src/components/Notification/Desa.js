import React, { Component } from 'react';
import { database, session } from '../../config';

import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentReturnedIcon from '@material-ui/icons/AssignmentReturned';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import NotFound from '../../assets/images/home/bg-not-found.webp';

class DesaNotification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            permasalahan: [],
            problems: []
        }
    }

    updateStatus = (id, status, idProblem) => {
        let newStatus = '';
        switch (status) {
            case 1:
                newStatus = 2;
                break;
            case 2:
                newStatus = 3;
                database.ref("problems/"+idProblem).update({
                    "status" : 0
                })
                break;
            case 3:
                newStatus = 4;
                break;
            default:
                break;
        }

        database.ref("solutions/"+id).update({
            "status" : newStatus
        })
    }

    getPermasalahan = () => {
        database.ref("problems").orderByChild("idUser").equalTo(session).on("value",
            (snapshot) => {
                if (snapshot.val() !== null) {
                    this.setState({ permasalahan: Object.entries(snapshot.val()) })
                }
            }
        )
    }

    getPermintaan = () => {
        database.ref("solutions").orderByChild("idDesa").equalTo(session).on("value",
            (snapshot) => {
                if (snapshot.val() !== null) {
                    this.setState({ problems: Object.entries(snapshot.val()) })
                }
            })
    }

    componentWillMount() {
        this.getPermasalahan();
        this.getPermintaan();
    }

    render() {
        let allProblems = this.state.permasalahan;
        let problems = this.state.problems;
        let permasalahan = [];
        let permintaan = [];
        let berjalan = [];
        let selesai = [];

        for (let i = 0; i < allProblems.length; i++) {
            let detailProblems = allProblems[i][1];

            permasalahan.push(
                <div className="container" key={i}>
                    <div className="title">
                        <div>< AssignmentIcon /></div>
                        <h6>{detailProblems.title}</h6>
                    </div>
                    <p>
                    {detailProblems.description}
                    </p>
                </div>
            )
        }

        for (let i = 0; i < problems.length; i++) {
            let detailProblems = problems[i][1];

            switch (detailProblems.status) {
                case 1:
                    permintaan.push(
                        <div className="container" key={i}>
                            <div className="title">
                                <div>< AssignmentIcon /></div>
                                <h6>{detailProblems.title}</h6>
                            </div>
                            <p>
                                {detailProblems.description}
                                <br /><br />
                                <b>NB : Kegiatan akan dilaksanakan pada {detailProblems.date}</b>
                            </p>
                            <div className="button-container">
                                <button className="bt bt-primary accept" onClick={() => { this.updateStatus(problems[i][0], 1) }}>Terima</button>
                                <button className="bt reject" onClick={() => { this.updateStatus(problems[i][0], 3) }}>Tolak</button>
                            </div>
                        </div>
                    )
                    break;
                case 2:
                    berjalan.push(
                        <div className="container" key={i}>
                            <div className="title">
                                <div style={{ background: '#ffc022' }}>< AssignmentReturnedIcon /></div>
                                <h6>{detailProblems.title}</h6>
                            </div>
                            <div className="button-container">
                                <button className="bt bt-primary accept" onClick={() => { this.updateStatus(problems[i][0], 2, detailProblems.idProblem) }}>Selesai</button>
                            </div>
                        </div>
                    )
                    break;
                case 3:
                    selesai.push(
                        <div className="container" key={i}>
                            <div className="title">
                                <div style={{ background: '#47d664' }}>< AssignmentTurnedInIcon /></div>
                                <h6>{detailProblems.title}</h6>
                            </div>
                        </div>
                    )
                    break;
                default:
                    break;
            }
        }
        
        if (permasalahan.length === 0) {
            permasalahan = <span className="not-found-alert" style={{ marginTop: '15vh'}}><img src={NotFound} alt="" /><h3>Tidak ada data yang bisa ditampilkan</h3></span>
        }

        if (permintaan.length === 0) {
            permintaan = <span className="not-found-alert" style={{ marginTop: '15vh'}}><img src={NotFound} alt="" /><h3>Tidak ada data yang bisa ditampilkan</h3></span>
        }

        if (berjalan.length === 0) {
            berjalan = <span className="not-found-alert" style={{ marginTop: '15vh'}}><img src={NotFound} alt="" /><h3>Tidak ada data yang bisa ditampilkan</h3></span>
        }

        if (selesai.length === 0) {
            selesai = <span className="not-found-alert" style={{ marginTop: '15vh'}}><img src={NotFound} alt="" /><h3>Tidak ada data yang bisa ditampilkan</h3></span>
        }

        return (
            <div>
                <div>
                    <div id="show-Permasalahan" className="hide">
                        {permasalahan}
                    </div>
                    <div id="show-Permintaan" className="hide">
                        {permintaan}
                    </div>
                    <div id="show-Berjalan" className="hide">
                        {berjalan}
                    </div>
                    <div id="show-Selesai" className="hide">
                        {selesai}
                    </div>
                </div>
            </div>
        )
    }
}

export default DesaNotification;