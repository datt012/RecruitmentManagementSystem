import { message } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import renderHTML from "react-render-html";
import { Link } from "react-router-dom";
import checkLoginApi from "../../../../api/checkLogin";
import saveWorkApi from "../../../../api/saveWorkApi";
import workApplyApi from "../../../../api/workApplyApi";
import { storage } from "../../../../firebase";
import {
    checkDateDealtime,
    formatDateWork,
} from "../../../container/Functionjs";
import qc from "../../../images/1227.gif";
import "../../../scss/DetailJob/Jd.scss";
import KeyTag from "../../Jobs/ListJobs/KeyTag";
export default function Jd(props) {
    let { data, id, isAdmin } = props;
    const [user, setUser] = useState();
    const [load, setLoad] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [notSave, setNotSave] = useState(true);
    const [messager, setMessager] = useState("");
    const [state, setState] = useState({ tenFile: "", file: "" });
    const { tenFile, file } = state;
    const [isShowApply, setIsShowApply] = useState(false);

    useEffect(() => {
        checkLoginApi.checkLogin().then((ok) => {
            if (ok.data.user.type === "user") {
                setUser(ok.data.user.id);
                workApplyApi.checkUserApply(ok.data.user.id).then(ok => {
                    if (ok) {
                        let checkUserApply = ok.workapply.findIndex(x => x.name === data.name)
                        if (checkUserApply < 0) {
                            setIsShowApply(true)
                        }
                    }
                })
            }
        });
        saveWorkApi.getAll({ userId: user, workId: id }).then((data) => {
            var a = data.data;
            var b = [];
            for (let i = 0; i < a.length; i++) {
                b.push({ id: a[i].id });
            }
            setDeleteId(b);
            if (data.data.length === 0) {
                setNotSave(true);
            } else {
                setNotSave(false);
            }
        });
    }, [user, load]);
    const onSaveWork = async () => {
        if (user) {
            await saveWorkApi.postsaveWork([{ userId: user, workId: id }]);
            setLoad(!load);
        } else {
            message.warning("B???n ch??a ????ng nh???p!");
        }
    };

    const onNotSaveWork = async () => {
        if (user) {
            for (let i = 0; i < deleteId.length; i++) {
                await saveWorkApi.deletesaveWork(deleteId[i].id);
            }
            setLoad(!load);
        } else {
            message.warning("B???n ch??a ????ng nh???p!");
        }
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = (e) => {
        if (e === "???? h???t h???n") {
            message.warning("C??ng vi???c ???? h???t h???n ???ng tuy???n!");
        } else {
            if (user) {
                setIsModalVisible(true);
            } else {
                message.warning("B???n ch??a ????ng nh???p!");
            }
        }
    };

    const hangdelFile = (e) => {
        setState({
            ...state,
            tenFile: e.target.files[0].name,
            file: e.target.files[0],
        });
    };

    const handleOk = async () => {
        if (messager === "" || tenFile === "") {

            message.warning("B???n c???n nh???p l???i nh???n v?? CV ????nh k??m!");
        } else {
            setConfirmLoading(true);

            await storage.ref(`fileCv/${file.name}`).put(file);
            const file1 = await storage.ref("fileCv").child(tenFile).getDownloadURL();
            console.log('getStatusActive(data.WorkApplies)', getStatusActive(data.WorkApplies))
            if (getStatusActive(data.WorkApplies) == "empty") {
                await workApplyApi.postworkApply([
                    { userId: user, workId: +id, message: messager, link: file1, status: 0, statusActive: null },
                ]).then(ok => {
                    props.reload()
                })
            } else {
                let index = data.WorkApplies.findIndex(b => b.userId == user)
                console.log('index', index);
                if (index < 0) {
                    await workApplyApi.postworkApply([
                        { userId: user, workId: +id, message: messager, link: file1, status: 0, statusActive: null },
                    ]).then(ok => {
                        props.reload()
                    })
                } else {
                    await workApplyApi.editworkApply(
                        { id: data.WorkApplies[index].id, userId: user, workId: +id, message: messager, link: file1, statusActive: null },
                    ).then(ok => {
                        props.reload()
                    })

                }

            }
            setIsModalVisible(false);
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getStatusActive = (data) => {
        if (data.length) {
            let index = data.findIndex(x => x.userId == user)
            if (index >= 0) {
                return data[index].statusActive
            }
            return null
        }
        return "empty"
    }

    const renderButtonApply = () => {
        if (!isAdmin && user) {
            if (getStatusActive(data.WorkApplies) == 1) {
                return (<div
                    className="apply "
                >
                    <Link to="#" className="green">Ph???ng v???n</Link>
                </div>)
            } else if (getStatusActive(data.WorkApplies) == 2) {
                return (<div
                    className="apply "
                >
                    <Link to="#" className="green">???????c nh???n</Link>
                </div>)

            } else if (getStatusActive(data.WorkApplies) == 3) {
                return (
                    <div className="apply d-flex">
                        <div style={{ marginRight: 20 }}>
                            <Link to="#" className="red">T??? ch???i</Link>
                        </div>
                        <div
                            onClick={() => showModal(checkDateDealtime(data.dealtime))}
                        >
                            <Link to="#">???ng tuy???n l???i</Link>
                        </div>
                    </div>
                )
            } else {
                if (isShowApply) {
                    return (<div
                        className="apply"
                        onClick={() => showModal(checkDateDealtime(data.dealtime))}
                    >
                        <Link to="#">???ng tuy???n ngay</Link>
                    </div>)
                } else {
                    return (<div
                        className="apply"
                    >
                        <Link to="#">???? n???p ????n ???ng tuy???n</Link>
                    </div>)
                }
            }
        }
    }

    return (
        <div className="Jd">
            <Modal
                title="???ng tuy???n"
                visible={isModalVisible}
                confirmLoading={confirmLoading}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className="form-group mb-3">
                    <textarea
                        className="form-control"
                        value={messager}
                        onChange={(e) => setMessager(e.target.value)}
                        name=""
                        id=""
                        cols="30"
                        rows="4"
                        placeholder="L???i nh???n"
                    ></textarea>
                </div>
                <label htmlFor="file" className="file">
                    File c???a b???n
                </label>
                <input type="file" onChange={hangdelFile} hidden name="" id="file" />
                <p>{file ? tenFile : ""}</p>
            </Modal>
            <div className="container">
                <div className="row">
                    <div className="col-md-9 ">
                        <div className="job__box">
                            <div className="job__box__title">
                                <h4>{data.name}</h4>
                            </div>
                            <div className="job__box__detail">
                                <div className="job__box__detail--address">
                                    <i className="fas fa-map-marker-alt"></i>
                                    {data.address}
                                </div>
                                <div className="job__box__detail--fulltime">
                                    <i className="fas fa-hourglass-half"></i>
                                    {data.nature}
                                </div>
                                <div className="job__box__detail--status">
                                    <i className="fas fa-unlock-alt"></i>
                                    {checkDateDealtime(data.dealtime)}
                                </div>
                                <div className="job__box--detail--salary">
                                    <i className="fas fa-dollar-sign"></i>
                                    {(data.price1 && data.price2) ?
                                        data.price1 + " - " + data.price2 + "tri???u"
                                        : "Th????ng l?????ng"
                                    }
                                </div>
                            </div>
                            {renderButtonApply()}
                        </div>
                        <div className="job__box">
                            <div>
                                <div className="job__box__title--jd">
                                    <p>M?? t??? c??ng vi???c</p>
                                </div>
                                <div className="job__box__content--jd">
                                    {renderHTML(data.description ?? "")}
                                </div>
                            </div>
                            <div>
                                <div className="job__box__title--jd">
                                    <p>Y??u c???u c??ng vi???c</p>
                                </div>
                                <div className="job__box__content--jd">
                                    {renderHTML(data.form ?? "")}
                                </div>
                            </div>
                            <div>
                                <div className="job__box__title--jd">
                                    <p>Quy???n l???i ???????c h?????ng</p>
                                </div>
                                <div className="job__box__content--jd">
                                    {renderHTML(data.interest ?? "")}
                                </div>
                            </div>
                            <div>
                                <div className="job__box__title--jd">
                                    <p>?????a ??i???m l??m vi???c</p>
                                </div>
                                <div className="job__box__content--jd">{data.address}</div>
                            </div>
                            <div>
                                <div className="job__box__title--jd">
                                    <p>T??nh ch???t c??ng vi???c</p>
                                </div>
                                <div className="job__box__content--jd">
                                    {renderHTML(data.nature ?? "")}
                                </div>
                            </div>
                            <div>
                                <div className="job__box__title--jd">
                                    <p>Y??u c???u b???ng c???p(t???i thi???u)</p>
                                </div>
                                <div className="job__box__content--jd">
                                    {renderHTML(data.request ?? "")}
                                </div>
                            </div>
                            <div>
                                <div className="job__box__title--jd">
                                    <p>Y??u c???u kinh nghi???m</p>
                                </div>
                                <div className="job__box__content--jd">
                                    {renderHTML(data.exprience ?? "")}
                                </div>
                            </div>
                            <div>
                                <div className="job__box__title--jd">
                                    <p>V??? tr?? c??ng ty</p>
                                </div>
                                <div className="job__box__content--jd">
                                    <div
                                        id="map-container-google-1"
                                        className="z-depth-1-half map-container"
                                        style={{ width: "100%" }}
                                    >
                                        {renderHTML(data.addressGoogle ?? "")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="deadline__box">
                            <div className="deadline">
                                <div className="deadline__icon">
                                    <i className="far fa-clock"></i>
                                </div>
                                <div>
                                    <div className="deadline__title">H???n ch??t</div>
                                    <div className="deadline__time">
                                        {formatDateWork(data.dealtime ?? "")}
                                    </div>
                                </div>
                            </div>
                            <div className="deadline__icon--bot">
                                <i className="far fa-clock"></i>
                            </div>
                        </div>
                        <div className="deadline__box">
                            <div className="deadline yellow">
                                <div className="deadline__icon">
                                    <i className="fas fa-user-graduate"></i>
                                </div>
                                <div>
                                    <div className="deadline__title">S??? l?????ng tuy???n</div>
                                    <div className="deadline__time">
                                        {console.log(data)}
                                        {data?.quantity}
                                    </div>
                                </div>
                            </div>
                            <div className="deadline__icon--bot">
                                <i className="fas fa-user-graduate"></i>
                            </div>
                        </div>
                        {user &&
                            <div
                                className="save__box"
                                onClick={notSave ? onSaveWork : onNotSaveWork}
                            >
                                <div className="save__box__title">
                                    {notSave ? "L??u c??ng vi???c" : "Hu??? l??u c??ng vi???c"}
                                </div>
                            </div>
                        }
                        {/* <div className="advertisement">
                            <img src={qc} alt="" />
                        </div> */}
                        <div className="box__keyTag">
                            <KeyTag />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
