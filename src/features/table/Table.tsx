import React, {ChangeEvent, Component, Fragment} from 'react';
import {connect, MapDispatchToProps, MapStateToProps} from 'react-redux';
// @ts-ignore
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import './table.scss';
import {
    toggleEdit,
    inputChange,
    editData,
    deleteRow,
    reorderList,
    Table as TableInterface,
    UserInterface
} from './tableSlice';

interface ConnectStateProps {
    table: TableInterface
}

interface ConnectDispatchProps {
    toggleEdit: (data: any) => void;
    editData: (data: any) => void;
    inputChange: (data: any) => void;
    deleteRow: (data: Array<number>) => void
    reorderList: (data: Array<UserInterface>) => void
}

interface MainState {
    tableHeader: Array<string>
    deleteMode: boolean,
    elementsToRemove: Array<number>
}

type HeaderProps = ConnectDispatchProps & ConnectStateProps

class Table extends Component<HeaderProps, MainState> {
    state = {
        tableHeader: ['ID', 'Name', 'Surname', 'Birthday', 'Age'],
        deleteMode: false,
        elementsToRemove: []
    }

    componentDidMount() {
        //localStorage.setItem('listData', JSON.stringify(this.props.table.list))
        window.addEventListener("storage", e => {
        });
    }

    // calculate user age
    calculateUserAge = (bDay: string): number => {
        // assuming that the date format is DD-MM-YYYY
        const year = parseInt(bDay.split('-')[2])
        const currentYear = new Date().getFullYear()

        return currentYear - year;
    }

    // edit single row element when enter button is triggered
    editRow = (e: any, idx: number, key: string, value: string): void => {
        if (e.keyCode === 13) {
            this.props.editData({idx: idx, key: key, value: value})
        }
    }

    // watch for all inputs changes in table elements
    handleInputChange = (e: ChangeEvent<HTMLInputElement>, idx: number, key: string) => {
        const elem = e.target;
        this.props.inputChange({idx: idx, value: elem.value, key: key})
    }

    // add or remove elements index for future removal
    handleCheckboxChange = (e: any, idx: number): void => {

        const newArr: Array<number> = [...this.state.elementsToRemove]

        if (e.target.checked) {
            newArr.push(idx)
            this.setState({elementsToRemove: newArr})
        } else {
            const index = newArr.indexOf(idx)
            newArr.splice(index, 1)
            this.setState({elementsToRemove: newArr})
        }
    }

    // switch delete mode
    toggleDeleteMode = (): void => {
        this.setState({deleteMode: !this.state.deleteMode})
    }

    // delete row from table
    removeRow = (): void => {
        this.props.deleteRow(this.state.elementsToRemove)
        this.toggleDeleteMode()
        this.setState({elementsToRemove: []})
    }

    // reorder items after onDragEnd
    reorder = (list: Array<object>, startIndex: number, endIndex: number): Array<object> => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    // onDragEnd required function
    onDragEnd = (result: DropResult): void => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items: any = this.reorder(
            this.props.table.list,
            result.source.index,
            result.destination.index
        );

        this.props.reorderList(items)
    };

    render() {
        //localStorage.setItem('listData', JSON.stringify(this.props.table.list))
        // const list = JSON.parse(localStorage.getItem('listData') || "[]");
        // console.log("STORAGE LIST", list)
        const {list} = this.props.table

        return <Fragment>
            <h1>Table List</h1>
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided: any) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} id='table-container'>
                            <div className='list-item head'>
                                {
                                    this.state.tableHeader.map((el, i) => (
                                            <div key={i}>
                                                <p>{el}</p>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                            {
                                list.map((el: UserInterface, i: number) => {
                                    return (
                                        <Draggable key={i} draggableId={`${i}`} index={i}>
                                            {(provided: any) => (
                                                <div ref={provided.innerRef}
                                                     {...provided.draggableProps}
                                                     {...provided.dragHandleProps}
                                                     className='list-item' key={i}>
                                                    <span>{i}</span>
                                                    <div>
                                                        {el.firstName.edit ? <input type="text"
                                                                                    onChange={(e) => this.handleInputChange(e, i, 'firstName')}
                                                                                    onKeyUp={(e) => this.editRow(e, i, 'firstName', el.firstName.val)}
                                                                                    value={el.firstName.val}/> :
                                                            <p onDoubleClick={() => this.props.toggleEdit({
                                                                idx: i,
                                                                key: 'firstName'
                                                            })}>{el.firstName.val}</p>}
                                                    </div>
                                                    <div>
                                                        {el.lastName.edit ? <input type="text"
                                                                                   onChange={(e) => this.handleInputChange(e, i, 'lastName')}
                                                                                   onKeyUp={(e) => this.editRow(e, i, 'lastName', el.lastName.val)}
                                                                                   value={el.lastName.val}/> :
                                                            <p onDoubleClick={() => this.props.toggleEdit({
                                                                idx: i,
                                                                key: 'lastName'
                                                            })}>{el.lastName.val}</p>}
                                                    </div>
                                                    <div>
                                                        {el.birthday.edit ? <input type="text"
                                                                                   onChange={(e) => this.handleInputChange(e, i, 'birthday')}
                                                                                   onKeyUp={(e) => this.editRow(e, i, 'birthday', el.birthday.val)}
                                                                                   value={el.birthday.val}/> :
                                                            <p onDoubleClick={() => this.props.toggleEdit({
                                                                idx: i,
                                                                key: 'birthday'
                                                            })}>{el.birthday.val}</p>}
                                                    </div>
                                                    <div>
                                                        <p>{this.calculateUserAge(el.birthday.val)}</p>
                                                    </div>
                                                    {this.state.deleteMode &&
                                                    <input onChange={(e) => this.handleCheckboxChange(e, i)}
                                                           className='delete-row' type='checkbox'/>}
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div id='control-buttons'>
                {!this.state.deleteMode &&
                <button className='danger' onClick={() => this.toggleDeleteMode()}>Delete Rows</button>}
                {this.state.deleteMode && this.state.elementsToRemove.length ?
                    <button onClick={() => this.removeRow()} className='danger'>Confirm</button> : null}
                {this.state.deleteMode &&
                <button className='primary' onClick={() => this.toggleDeleteMode()}>Cancel Delete</button>}
            </div>
        </Fragment>
    }
}

type ConnectStateMapper = MapStateToProps<ConnectStateProps, Object>


const mapStateToProps: ConnectStateMapper = (state: any) => {
    const {table} = state;
    return {
        table
    }

};

type ConnectDispatchMapper = MapDispatchToProps<ConnectDispatchProps, Object>

const mapDispatchToProps: ConnectDispatchMapper = (dispatch: any) => {
    return {
        toggleEdit: (data) => dispatch(toggleEdit(data)),
        editData: (data) => dispatch(editData(data)),
        inputChange: (data) => dispatch(inputChange(data)),
        deleteRow: (data) => dispatch(deleteRow(data)),
        reorderList: (data) => dispatch(reorderList(data))
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(Table);