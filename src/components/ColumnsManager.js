import {useState} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {includes, concat} from 'lodash';

export default function ColumnsManager({allColumns, selectedColumns, updateSelectedColumns}) {

    let selectedColumnsId = [];
    selectedColumns.map(i => {
        selectedColumnsId.push(i.id)
    });

    let otherColumns = allColumns.filter(v => {
        if(!includes(selectedColumnsId, v.id)) {
            return v;
        }
    });

    const columnsState = {
        ['items']: {
            name: "items",
            items: otherColumns
        },
        ['selected']: {
            name: "selected",
            items: selectedColumns,
        },
    };

    const [show, setShow] = useState(false);
    const [search, changeSearch] = useState('');
    const [columns, setColumns] = useState(columnsState);
    const [searchLength, setSearchLength] = useState(0);
    
    const handleClose = () => {
        setShow(false);
        changeSearch('');
        setColumns({
            ...columns,
            ['selected']: {
                ...columns['selected'],
                items: selectedColumns,
            },
            ['items']: {
                ...columns['items'],
                items: otherColumns
            }
        });
    };

    const handleApply = () => {
        setShow(false);
        changeSearch('');
        updateSelectedColumns(columns['selected'].items);
    };

    const handleShow = () => setShow(true);

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    const handleSearch = (e) => {
        let value = e.target.value;

        if(value.length < searchLength) {
            let selectedColumnsId = [];
            columns.selected.items.map(i => {
                selectedColumnsId.push(i.id)
            });

            let otherColumns = allColumns.filter(v => {
                if(!includes(selectedColumnsId, v.id)) {
                    return v;
                }
            });

            setColumns({
                ...columns,
                ['items']: {
                    ...columns['items'],
                    items: otherColumns.filter(item => item.content.toLowerCase().includes(value.toLowerCase()))
                },
            });
        } else {
            setColumns({
                ...columns,
                ['items']: {
                    ...columns['items'],
                    items: columns.items.items.filter(item => item.content.toLowerCase().includes(value.toLowerCase()))
                },
            });
        }

        setSearchLength(value.length);
        changeSearch(value);
    };

    const handleDelete = (item) => {
        let filterSelected = columns.selected.items.filter(function(e){
            return e.id != item.id;
        });

        setColumns({
            ...columns,
            ['selected']: {
                ...columns['selected'],
                items: filterSelected,
            },
            ['items']: {
                ...columns['items'],
                items: concat(columns.items.items, {...item})
            }
        });
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Select Grid Columns
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Select Grid Columns</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={6}>
                            <Form>
                                <Form.Group className="mb-3" controlId="search">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={search}
                                        onChange={handleSearch}
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <DragDropContext
                            onDragEnd={result => onDragEnd(result, columns, setColumns)}
                        >
                            {Object.entries(columns).map(([columnId, column], index) => {
                                return (
                                    <Col
                                        key={columnId}
                                    >
                                        {/*<h2>{column.name}</h2>*/}
                                        <Droppable droppableId={columnId} key={columnId}>
                                            {(provided, snapshot) => {
                                                return (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            background: snapshot.isDraggingOver
                                                                ? "lightblue"
                                                                : "lightgrey",
                                                            padding: 4,
                                                            width: '100%',
                                                            minHeight: 500
                                                        }}
                                                    >
                                                        {column.items.length ? column.items.map((item, index) => {
                                                            return (
                                                                <Draggable
                                                                    key={item.id}
                                                                    draggableId={item.id}
                                                                    index={index}
                                                                    isDragDisabled={column.items.length === 1}
                                                                >
                                                                    {(provided, snapshot) => {
                                                                        return (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{
                                                                                    userSelect: "none",
                                                                                    padding: 8,
                                                                                    margin: "0 0 8px 0",
                                                                                    minHeight: "50px",
                                                                                    backgroundColor: snapshot.isDragging
                                                                                        ? "#263B4A"
                                                                                        : "#456C86",
                                                                                    color: "white",
                                                                                    display: "flex",
                                                                                    justifyContent: "space-between",
                                                                                    alignItems: "center",
                                                                                    ...provided.draggableProps.style
                                                                                }}
                                                                            >
                                                                                {item.content}
                                                                                {columnId == 'selected' ?
                                                                                    <Button
                                                                                        variant="secondary"
                                                                                        onClick={() => handleDelete(item)}
                                                                                        disabled={column.items.length === 1}
                                                                                    >
                                                                                        x
                                                                                    </Button> : ''
                                                                                }
                                                                            </div>

                                                                        );
                                                                    }}
                                                                </Draggable>
                                                            );
                                                        }) : <div>No items</div>}
                                                        {provided.placeholder}
                                                    </div>
                                                );
                                            }}
                                        </Droppable>
                                    </Col>
                                );
                            })}
                        </DragDropContext>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleApply}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}