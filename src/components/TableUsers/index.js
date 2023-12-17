import { fetchAllUser } from '../../services/userService';
import { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDownLong, faArrowUpLong, faPlusCircle, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';

import ModalAddNew from '../ModalAddNew';
import ModalEditUser from '../ModalEditUser';
import ModalConfirm from '../ModalConfirm';
import _, { debounce } from 'lodash';
import { CSVLink, CSVDownload } from 'react-csv';

function TableUsers(props) {
    //----------------- Pages and call API ----------------------
    const [listUser, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);

    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState({});

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({});

    const [sortBy, setSortBy] = useState('asc');
    const [sortField, setSortField] = useState('id');

    const [keyword, setKeyWord] = useState('');

    const [dataExport, setDataExport] = useState([]);

    useEffect(() => {
        getUsers(1);
    }, []);

    const getUsers = async (page) => {
        let res = await fetchAllUser(page);

        if (res && res.data) {
            setTotalUsers(res.total);
            setTotalPages(res.total_pages);
            setListUsers(res.data);
        }
    };

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1);
    };

    //------------------ Button new user ----------------------
    const handleClose = () => {
        setIsShowModalAddNew(false);
        setIsShowModalEdit(false);
        setIsShowModalDelete(false);
    };

    const handleUpdateTable = (user) => {
        setListUsers([user, ...listUser]);
    };

    //------------------ Edit user ----------------------
    const handleEditUser = (user) => {
        setDataUserEdit(user);
        setIsShowModalEdit(true);
    };

    const handleEditUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUser);
        let index = listUser.findIndex((item) => item.id === user.id);
        cloneListUsers[index].first_name = user.first_name;

        setListUsers(cloneListUsers);
    };

    //------------------ Delete user ----------------------
    const handleDeleteUser = (user) => {
        setIsShowModalDelete(true);
        setDataUserDelete(user);
    };

    const handleDeleteUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUser);

        cloneListUsers = cloneListUsers.filter((item) => item.id !== user.id);

        setListUsers(cloneListUsers);
    };

    //------------------ SortBy ----------------------

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListUsers = _.cloneDeep(listUser);
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setListUsers(cloneListUsers);
    };

    //------------------ Filter by email----------------------
    const handleSearch = debounce((event) => {
        let term = event.target.value;
        if (term) {
            let cloneListUsers = _.cloneDeep(listUser);
            cloneListUsers = cloneListUsers.filter((item) => item.email.includes(term));
            setListUsers(cloneListUsers);
        } else {
            getUsers(1);
        }
    }, 1000);

    //------------------ Export data----------------------
    const getUserExport = (event, done) => {
        let result = [];
        if (listUser && listUser.length > 0) {
            result.push(['Id', 'Email', 'First name', 'Last name']);
            listUser.map((item, index) => {
                let arr = [];
                arr[0] = item.id;
                arr[1] = item.email;
                arr[2] = item.first_name;
                arr[3] = item.last_name;
                result.push(arr);
            });
            setDataExport(result);
            done();
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between my-3">
                <h3>List User:</h3>
                <div>
                    <Button variant="dark" style={{ marginRight: '10px' }}>
                        <FontAwesomeIcon icon={faUpload} />
                        <label style={{ marginLeft: '5px' }} htmlFor="import">
                            Import
                        </label>
                    </Button>
                    <input id="import" type="file" hidden />

                    <CSVLink
                        data={dataExport}
                        asyncOnClick={true}
                        // tham chiếu đến hàm, và thư viện trả về Event and Done
                        onClick={getUserExport}
                        style={{ marginRight: '10px' }}
                    >
                        <Button variant="secondary">
                            <FontAwesomeIcon icon={faDownload} />
                            <span style={{ marginLeft: '5px' }}>Export</span>
                        </Button>
                    </CSVLink>

                    <Button variant="primary" onClick={() => setIsShowModalAddNew(true)}>
                        <FontAwesomeIcon icon={faPlusCircle} />
                        <span style={{ marginLeft: '5px' }}>Add new</span>
                    </Button>
                </div>
            </div>
            <div className="col-4 my-3">
                <Form.Control
                    type="email"
                    placeholder="Search user by email"
                    // value={keyword}
                    onChange={(event) => handleSearch(event)}
                />
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th className="d-flex justify-content-between">
                            ID
                            <snap>
                                <FontAwesomeIcon onClick={() => handleSort('desc', 'id')} icon={faArrowDownLong} />
                                <FontAwesomeIcon onClick={() => handleSort('asc', 'id')} icon={faArrowUpLong} />
                            </snap>
                        </th>
                        <th>Email</th>
                        <th className="d-flex justify-content-between">
                            First Name
                            <snap>
                                <FontAwesomeIcon
                                    onClick={() => handleSort('desc', 'first_name')}
                                    icon={faArrowDownLong}
                                />
                                <FontAwesomeIcon onClick={() => handleSort('asc', 'first_name')} icon={faArrowUpLong} />
                            </snap>
                        </th>
                        <th>Last Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {listUser &&
                        listUser.length > 0 &&
                        listUser.map((item, index) => {
                            return (
                                <tr key={`users-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td>
                                        <Button variant="info" className="mx-3" onClick={() => handleEditUser(item)}>
                                            Edit
                                        </Button>
                                        <Button variant="warning" onClick={() => handleDeleteUser(item)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="< previous"
                //-------------
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
            />
            <ModalAddNew show={isShowModalAddNew} handleClose={handleClose} handleUpdateTable={handleUpdateTable} />

            <ModalEditUser
                show={isShowModalEdit}
                handleClose={handleClose}
                dataUserEdit={dataUserEdit}
                handleEditUserFromModal={handleEditUserFromModal}
            />

            <ModalConfirm
                show={isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleDeleteUserFromModal={handleDeleteUserFromModal}
            />
        </>
    );
}

export default TableUsers;
