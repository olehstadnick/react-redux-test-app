import {useEffect} from "react";
import {connect} from "react-redux";
import {Container, Row, Col, Table} from 'react-bootstrap';
import parse from 'html-react-parser';

import {
    getUsers as getUsersAction,
    updateSelectedColumns as updateSelectedColumnsAction
} from './redux/modules/users';
import ColumnsManager from "./components/ColumnsManager";

function App({users, getUsers, allColumns, selectedColumns, columnNames, updateSelectedColumns}) {

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    function getThs() {
        let ths = '';
        for (let i = 0; i < selectedColumns.length; i++){
            let supp = selectedColumns[i];
            
            switch (supp.id) {
                case 'id':
                case 'name':
                case 'username':
                case 'email':
                case 'address_street':
                case 'address_suite':
                case 'address_city':
                case 'address_zipcode':
                case 'phone':
                case 'website':
                case 'company_name':
                     ths += `<th>${supp.content}</th>`;
                break;
                default:
                    break;
            }
        }

        return ths;
    }

    function getTds() {
        let ths = '';
        users.length ? users.map(item => {
            ths += '<tr>';
            for (let i = 0; i < selectedColumns.length; i++) {
                let supp = selectedColumns[i];

                switch (supp.id) {
                    case 'id':
                        ths += `<td>${item.id}</td>`;
                        break;
                    case 'name':
                        ths += `<td>${item.name}</td>`;
                        break;
                    case 'username':
                        ths += `<td>${item.username}</td>`;
                        break;
                    case 'email':
                        ths += `<td>${item.email}</td>`;
                        break;
                    case 'address_street':
                        ths += `<td>${item.address ? item.address.street : '-'}</td>`;
                        break;
                    case 'address_suite':
                        ths += `<td>${item.address ? item.address.suite : '-'}</td>`;
                        break;
                    case 'address_city':
                        ths += `<td>${item.address ? item.address.city : '-'}</td>`;
                        break;
                    case 'address_zipcode':
                        ths += `<td>${item.address ? item.address.zipcode : '-'}</td>`;
                        break;
                    case 'phone':
                        ths += `<td>${item.phone}</td>`;
                        break;
                    case 'website':
                        ths += `<td>${item.website}</td>`;
                        break;
                    case 'company_name':
                        ths += `<td>${item.company ? item.company.name : '-'}</td>`;
                        break;
                    default:
                        break;
                }
            }
            ths += '</tr>';
        }) : ths += `<tr><td colSpan="100%" class="text-center">No items</td></tr>`;

        return ths;
    }
    
    return (
        <div className="App my-3">
            <Container>
                <Row className="mb-3 align-items-center">
                    <Col>
                        Users
                    </Col>
                    <Col className="text-right">
                        <div className="float-end">
                            <ColumnsManager
                                allColumns={allColumns}
                                selectedColumns={selectedColumns}
                                columnNames={columnNames}
                                updateSelectedColumns={updateSelectedColumns}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                {parse(getThs())}
                            </tr>
                            </thead>
                            <tbody>
                                {parse(getTds())}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default connect(
    ({users}) => ({
        users: users.users,
        allColumns: users.allColumns,
        selectedColumns: users.selectedColumns,
    }),
    {
        getUsers: getUsersAction,
        updateSelectedColumns: updateSelectedColumnsAction
    }
)(App);
