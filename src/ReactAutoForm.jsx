"use strict"
let k = 1;
const ReactAutoForm = React.createClass({
    propTypes: {
        form: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            schemaName: ''
        };
    },
    componentDidMount(){
        let dateTimePickers = document.getElementsByName('dateTimePickers');
        let dateTimePickers2 = $("div[name='dateTimePickers']");
        //console.log("dateTimePickers:", dateTimePickers.length + " dateTimePickers2:" + dateTimePickers2.length);
        for (var k = 0; k < dateTimePickers.length; k++) {
            dateTimePickers[k].datetimepicker({
                format: Constants.Time.toMs
            });
        }
    },
    //input change events
    handleFunc(event){
        event.preventDefault();
        let data = this.props.form && this.props.form.data ? this.props.form.data : {};
        let value = event.target.type === 'number' ? Number(event.target.value.trim()) : event.target.value.trim();
        let keys = event.target.id.split('.');
        if (keys.length > 1) {
            data[keys[0]] = data[keys[0]] ? data[keys[0]] : {[keys[1]]: ''};
            data[keys[0]][keys[1]] = value;
            if (value == '' || !value) {
                delete data[keys[0]][keys[1]];
            }
        } else {
            data[keys[0]] = value;
        }
        this.props.onChange(data);
    },
    //select change events
    handleSelectFunc(event){
        event.preventDefault();
        let data = this.props.form && this.props.form.data ? this.props.form.data : {};
        let value = event.target.type === 'number' ? Number(event.target.value.trim()) : event.target.value.trim();
        let keys = event.target.id.split('.');
        if (keys.length > 1) {
            data[keys[0]] = data[keys[0]] ? data[keys[0]] : {};
            data[keys[0]][keys[1]] = value;
            if (value == '' || !value) {
                delete data[keys[0]][keys[1]];
            }
        } else {
            data[keys[0]] = value;
        }
        this.props.onChange(data);
    },
    //checkbox change events
    handleCheckFun(event){
        let checkBoxs = document.getElementsByName(event.target.id);
        let values = [];
        _.each(checkBoxs, function (item) {
            if (item.checked) {
                values.push(item.value);
            }
        });
        var data = values.length >
                   0 ?
                   _.extend({}, this.props.form.data, {[event.target.id]: values.join(",")}) :
                   this.props.form.data;
        var proper = {[event.target.id]: values.join(",")};
        this.props.onChange(data);
        //this.props.saveProperty(proper);
    },
    //array checkbox change events
    handleArrayCheckFun(event){
        let checkBoxs = document.getElementsByName(event.target.id);
        let values = [];
        _.each(checkBoxs, function (item) {
            if (item.checked) {
                values.push(item.value);
            }
        });
        var data = values.length >
                   0 ?
                   _.extend({}, this.props.form.data, {[event.target.id]: values}) :
                   this.props.form.data;
        var proper = {[event.target.id]: values};
        // this.props.saveProperty(proper);
        this.props.onChange(data);
    },
    // input onBuar events save current fileds
    saveProperty(event){
        event.preventDefault();
        /*let value = event.target.value.trim();
         if (!value) {
         return false;
         }
         let proper = {[event.target.id]: value};
         this.props.saveProperty(proper)*/
    },
    //array or object fileds new child
    addChild(event){
        event.preventDefault();
        let props = this.props;
        let form = this.props.form;
        let itemsName = !$(event.target).parents("div").attr("data-id") ?
                        $(event.target).attr("data-id") :
                        $(event.target).parents("div").attr("data-id");

        _.map(form.schema, function (sechma) {
            switch (sechma.formType) {
                case 'array_object':
                    if (sechma.name == itemsName) {
                        let obj = _.object(_.map(sechma.options, function (option) {
                            return option.name;
                        }), _.map(sechma.options, function (option, index) {
                            if (option.name == 'no') {
                                return form.data[itemsName] ? form.data[itemsName].length + 1 : 1;
                                ;
                            }
                            if (option.name == "status") {
                                return 'delete'
                            } else {
                                return '';
                            }

                        }));
                        let values = form.data[itemsName] ? form.data[itemsName].concat([obj]) : [obj];
                        var data = _.extend({}, form.data, {[itemsName]: values});
                        props.onChange(data);
                    }
                    break;
                case 'array':
                    if (sechma.name == itemsName) {
                        let values = form.data[itemsName] ? form.data[itemsName].concat(['']) : [''];
                        var data = _.extend({}, form.data, {[itemsName]: values});
                        props.onChange(data);
                    }
                    break;
                case 'object':
                    if (sechma.name == itemsName) {
                        let obj = _.object(_.map(sechma.object.objects, function (object) {
                            return object.name;
                        }), _.map(sechma.object.objects, function (object) {
                            return '';
                        }));
                        let values = {};
                        if (form.data[itemsName]) {
                            values = _.extend(form.data[itemsName], {['key' + k]: obj});
                        } else {
                            values = {'key': obj}
                        }
                        var data = _.extend({}, form.data, {[itemsName]: values});
                        props.onChange(data);
                        k++;
                    }
                    break;
            }
        });

    },
    //
    arrayChildHandleFunc(event){
        event.preventDefault();
        let form = this.props.form;
        let id = event.target.id;
        let value = event.target.type === 'number' ? Number(event.target.value.trim()) : event.target.value.trim();
        form.data[id.split('-')[0]][id.split('-')[1]] = value;
        this.props.onChange(form.data);
    },
    saveArrayProperty(event){
        event.preventDefault();
        let form = this.props.form;
        let id = event.target.id;
        let values = form.data[id.split('-')[0]] ? form.data[id.split('-')[0]] : [];
        var proper = {[id.split('-')[0]]: _.compact(values)};
        // this.props.saveProperty(proper);
    },
    objectChildHandleFunc(event){
        event.preventDefault();
        let form = this.props.form;
        let id = event.target.id;
        let value = event.target.type === 'number' ? Number(event.target.value.trim()) : event.target.value.trim();
        let keys = _.keys(form.data[id.split('-')[0]]);
        if (id.split('-').length == 3) {
            form.data[id.split('-')[0]][value] = form.data[id.split('-')[0]][keys[id.split('-')[1]]];
            delete  form.data[id.split('-')[0]][keys[id.split('-')[1]]]
        }
        if (id.split('-').length > 3) {
            form.data[id.split('-')[0]][keys[id.split('-')[1]]][id.split('-')[3]] = value;
        }
        this.props.onChange(form.data);
    },
    arrayAndObjectChildHandleFunc(event){
        event.preventDefault();
        let form = this.props.form;
        let id = event.target.id;
        let value = event.target.type === 'number' ? Number(event.target.value.trim()) : event.target.value.trim();
        form.data[id.split('-')[0]][id.split('-')[1]][id.split('-')[3]] = value;
        this.props.onChange(form.data);
    },
    keyDown (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            return false;
        }
    },
    removeChild(event){
        event.preventDefault();
        let form = this.props.form;
        let id = !$(event.target).parents("div").attr("id") ?
                 $(event.target).attr("id") :
                 $(event.target).parents("div").attr("id");
        if (id.split('-')[2] == 'array') {
            form.data[id.split('-')[0]].splice(id.split('-')[1], 1);
            this.props.onChange(form.data);
            //  var proper = {[id.split('-')[0]]: _.compact(form.data[id.split('-')[0]])};
            //this.props.saveProperty(proper);
        }
        if (id.split('-')[2] == 'object') {
            delete form.data[id.split('-')[0]][id.split('-')[3]];
            this.props.onChange(form.data);
        }
    },
    openOrganizationModal(event){
        "use strict";
        event.preventDefault();
        var schemaName = !$(event.target).parents("button").attr("data-id") ?
                         $(event.target).attr("data-id") :
                         $(event.target).parents("button").attr("data-id");
        this.setState({schemaName: schemaName});
        $('#staffListModal').modal('show');
    },
    organizationSetValue(data){
        "use strict";
        let form = this.props.form;
        console.log("organizationSetValue:", data);
        let key = _.keys(data)[0];
        if (form && form.data && form.data[key]) {
            data[key] = _.union(form.data[key].concat(data[key]));
        }
        let formData = _.extend({}, this.props.form.data, data);
        this.props.onChange(formData);
    },
    renderFrom(schema, index){
        let that = this;
        let form = this.props.form;
        switch (schema.formType) {
            case 'input':
                return (
                    <div className="form-group " key={'div_input'+index}>
                        <label htmlFor={schema.name} className="control-label col-lg-1">{schema.label}</label>

                        <div className="col-lg-5">
                            <input className="form-control" id={schema.name} name={schema.name} type={schema.type}
                                readOnly={schema.readonly?schema.readonly:''}
                                onChange={that.handleFunc} onBlur={that.saveProperty}
                                value={schema.name.split('.').length > 1 && form.data[schema.name.split('.')[0]] && form.data[schema.name.split('.')[0]][schema.name.split('.')[1]]  ? form.data[schema.name.split('.')[0]][schema.name.split('.')[1]] : form.data[schema.name]}
                                placeholder={schema.placeholder}/>
                        </div>
                    </div>
                );
                break;
            case 'textarea':
                return (
                    <div className="form-group " key={'div_textarea'+index}>
                        <label htmlFor={schema.name} className="control-label col-lg-1">{schema.label}</label>
                        <div className="col-lg-5">
                        <textarea
                        className=" form-control"
                        id={schema.name}
                        name={schema.name}
                        onChange={that.handleFunc}
                        onBlur={that.saveProperty}
                        value={schema.name.split('.').length > 1 && form.data[schema.name.split('.')[0]] && form.data[schema.name.split('.')[0]][schema.name.split('.')[1]]  ? form.data[schema.name.split('.')[0]][schema.name.split('.')[1]] : form.data[schema.name]}
                        placeholder={schema.placeholder}>
                        </textarea>
                        </div>
                    </div>
                );
                break;
            case 'select':
                return (
                    <div className="form-group " key={'div_select'+index}>
                        <label htmlFor={schema.name} className="control-label col-lg-1">{schema.label}</label>

                        <div className="col-lg-5">
                            <select className="form-control" name={schema.name} id={schema.name} type={schema.type}
                                onChange={that.handleSelectFunc}
                                value={schema.name.split('.').length > 1 && form.data[schema.name.split('.')[0]] && form.data[schema.name.split('.')[0]][schema.name.split('.')[1]]  ? form.data[schema.name.split('.')[0]][schema.name.split('.')[1]] : form.data[schema.name]}>
                                {
                                    schema.options.map(function (option, op_index) {
                                        return (
                                            <option value={option.value}
                                                key={'div_select_option'+index+op_index}>{option.label}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                );
                break;
            case 'radio':
                return (
                    <div className="form-group " key={'div_radio'+index}>
                        <label htmlFor={schema.name} className="control-label col-lg-1">{schema.label}</label>

                        <div className="col-lg-5">
                            {
                                schema.options.map(function (option, radio_index) {
                                    return (
                                        <label className="radio-inline" key={'div_radio_label'+index+radio_index}>
                                            <input type="radio" name={schema.name} id={schema.name}
                                                value={option.value}/>{option.label}
                                        </label>
                                    )
                                })
                            }
                        </div>
                    </div>
                );
                break;
            case 'checkbox':
                return (
                    <div className="form-group " key={'div_checkbox'+index}>
                        <label htmlFor={schema.name} className="control-label col-lg-1">{schema.label}</label>

                        <div className="checkbox">

                            {
                                schema.options.map(function (option, radio_index) {
                                    return (
                                        <label className="radio-inline" key={'div_checkbox_label'+index+radio_index}>
                                            <input type="checkbox" name={schema.name} id={schema.name}
                                                value={option.value}
                                                checked={_.contains(form.data[schema.name] ? form.data[schema.name].split(',') : [], option.value)}
                                                onChange={that.handleCheckFun}/>{option.label}
                                        </label>
                                    )
                                })
                            }
                        </div>
                    </div>
                );
                break;
            case 'array':
                if (schema.model && schema.options) {
                    switch (schema.model) {
                        case 'checkbox':
                            return (
                                <div className="form-group " key={'div_array_checkbox'+index}>
                                    <label htmlFor={schema.name}
                                        className="control-label col-lg-1">{schema.label}</label>

                                    <div className="checkbox">
                                        {
                                            schema.options.map(function (option, radio_index) {
                                                return (
                                                    <label className="radio-inline"
                                                        key={'div_array_checkbox_label'+index+radio_index}>
                                                        <input type="checkbox" name={schema.name} id={schema.name}
                                                            checked={_.contains(form.data[schema.name],option.value)}
                                                            value={option.value}
                                                            onChange={that.handleArrayCheckFun}/>{option.label}
                                                    </label>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            );
                            break;
                    }
                } else {
                    return (
                        <div className="form-group " key={'div_array'+index}>
                            <label className="control-label col-lg-1">{schema.label}</label>

                            <div className="col-lg-5">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                    <tr>
                                        <th style={{width: 10}}>
                                            <div className="btn-group btn-group-xs" data-id={schema.name}>
                                                <button type="button" className="btn btn-primary btn-lg"
                                                    data-id={schema.name} id={schema.name} onClick={that.addChild}>
<span className="glyphicon glyphicon-plus"
    aria-hidden="true"></span>
                                                </button>
                                            </div>
                                        </th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {form.data && form.data[schema.name] ?
                                     form.data[schema.name].map(function (value, child_index) {
                                         return (
                                             <tr key={'div_array_tr'+index+child_index}>
                                                 <td>
                                                     <div className="btn-group btn-group-xs"
                                                         id={schema.name+'-'+child_index+'-array'}>
                                                         <button type="button" className="btn btn-primary btn-lg"
                                                             id={schema.name+'-'+child_index+'-array'}
                                                             onClick={that.removeChild}>
                                                            <span className="glyphicon glyphicon-minus"
                                                                aria-hidden="true"></span>
                                                         </button>
                                                     </div>
                                                 </td>
                                                 <td><input className="form-control input-sm"
                                                     name={schema.name+'-'+child_index}
                                                     id={schema.name+'-'+child_index}
                                                     type={schema.type} value={value}
                                                     onChange={that.arrayChildHandleFunc}
                                                     onBlur={that.saveArrayProperty}/>
                                                 </td>
                                             </tr>
                                         )
                                     }) : ''
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }
                break;
            case 'object':
                var keys = form.data && form.data[schema.name] ? _.keys(form.data[schema.name]) : [];
                return (
                    <div className="form-group " key={'div_object'+index}>
                        <label className="control-label col-lg-1">{schema.label}</label>

                        <div className="col-lg-11">
                            <table className="table table-bordered table-hover" name={schema.name} id={schema.name}>
                                <thead>
                                <tr>
                                    <th style={{width: 10}}>
                                        <div className="btn-group btn-group-xs" data-id={schema.name}>
                                            <button type="button" className="btn btn-primary btn-lg"
                                                data-id={schema.name} id={schema.name} onClick={that.addChild}>
<span className="glyphicon glyphicon-plus"
    aria-hidden="true"></span>
                                            </button>
                                        </div>
                                    </th>
                                    { schema.object && schema.object.options ?
                                      schema.object.options.map(function (option, option_index) {
                                          return (
                                              <th key={'div_object_th_options'+index+option_index}>{option.label}</th>
                                          )
                                      }) : ''
                                    }
                                    {
                                        schema.object && schema.object.objects ?
                                        schema.object.objects.map(function (object, object_index) {
                                            return (
                                                <th key={'div_object_th_object' + index + object_index}>{object.label}</th>
                                            )
                                        }) : ''
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    form.data && form.data[schema.name] && schema.object ?
                                    keys.map(function (key, child_tr_index) {
                                        return (
                                            <tr key={'div_object_tr'+index+child_tr_index}>
                                                <td>
                                                    <div className="btn-group btn-group-xs"
                                                        id={schema.name+'-'+child_tr_index+'-object-'+key}>
                                                        <button type="button" className="btn btn-primary btn-lg"
                                                            id={schema.name+'-'+child_tr_index+'-object-'+key}
                                                            onClick={that.removeChild}>
<span className="glyphicon glyphicon-minus"
    aria-hidden="true"></span>
                                                        </button>
                                                    </div>
                                                </td>
                                                {schema.object && schema.object.options ?
                                                 schema.object.options.map(function (opt, opt_index) {
                                                     switch (opt.formType) {
                                                         case 'select':
                                                             return (
                                                                 <td key={'div_object_tr_td'+index+child_tr_index+opt_index}>
                                                                     <select
                                                                         id={schema.name+'-'+child_tr_index+'-'+opt_index}
                                                                         name={schema.name+'-'+child_tr_index+'-'+opt_index}
                                                                         onChange={that.objectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         value={key}>
                                                                         { opt.options ?
                                                                           opt.options.map(function (opt_se,
                                                                                                     opt_se_index) {
                                                                               return (
                                                                                   <option value={opt_se.value}
                                                                                       key={'div_object_tr_td_select'+index+child_tr_index+opt_index+opt_se_index}>{opt_se.label}</option>
                                                                               )
                                                                           }) : ''
                                                                         }
                                                                     </select>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'input':
                                                             return (
                                                                 <td key={'div_object_tr_td'+index+child_tr_index+opt_index}>
                                                                     <input
                                                                         id={schema.name+'-'+child_tr_index+'-'+opt_index}
                                                                         name={key}
                                                                         onChange={that.objectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         value={key}/>
                                                                 </td>
                                                             );
                                                             break;
                                                     }
                                                 }) : ''
                                                }
                                                {schema.object && schema.object.objects ?
                                                 schema.object.objects.map(function (opt, opt_index) {
                                                     switch (opt.formType) {
                                                         case 'select':
                                                             return (
                                                                 <td key={'div_object_tr_td_o'+index+child_tr_index+opt_index}>
                                                                     <select
                                                                         id={schema.name+'-'+child_tr_index+'-'+opt_index+'-'+opt.name}
                                                                         name={schema.name+'-'+child_tr_index+'-'+opt_index+'-'+opt.name}
                                                                         onChange={that.objectChildHandleFunc}
                                                                         type={opt.type}
                                                                         className="form-control input-sm"
                                                                         value={form.data[schema.name][key][opt.name]}>
                                                                         { opt.options ?
                                                                           opt.options.map(function (opt_se,
                                                                                                     opt_se_index) {
                                                                               return (
                                                                                   <option value={opt_se.value}
                                                                                       key={'div_object_tr_td_o_select'+index+child_tr_index+opt_index+opt_se_index}>{opt_se.label}</option>
                                                                               )
                                                                           }) : ''
                                                                         }
                                                                     </select>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'input':
                                                             return (
                                                                 <td key={'div_object_tr_td_o'+index+child_tr_index+opt_index}>
                                                                     <input
                                                                         id={schema.name+'-'+child_tr_index+'-'+opt_index+'-'+opt.name}
                                                                         name={schema.name+'-'+child_tr_index+'-'+opt_index+'-'+opt.name}
                                                                         ref={opt.name}
                                                                         type={opt.type}
                                                                         onChange={that.objectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         value={form.data[schema.name][key][opt.name]}/>
                                                                 </td>
                                                             );
                                                             break;
                                                     }
                                                 }) : ''
                                                }
                                            </tr>
                                        )
                                    }) : ''
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                break;
            case 'array_object':
                return (
                    <div className="form-group " key={'div_array_object'+index}>
                        {schema.label ? <label className="control-label col-lg-1">{schema.label}</label> : ''}
                        <div className={schema.col_lg ? schema.col_lg : "col-lg-11"}>
                            <table className="table table-bordered table-hover" name={schema.name} id={schema.name}>
                                <thead>
                                <tr>
                                    {schema.nonAddBtn ? null :
                                     <th style={{width: 10}}>
                                         <div className="btn-group btn-group-xs" data-id={schema.name}>
                                             <button type="button" className="btn btn-primary btn-lg"
                                                 data-id={schema.name} id={schema.name} onClick={that.addChild}>
                                                <span className="glyphicon glyphicon-plus"
                                                    aria-hidden="true"></span>
                                             </button>
                                         </div>
                                     </th>
                                    }
                                    { schema.options ?
                                      schema.options.map(function (option, option_index) {
                                          return (
                                              <th key={'div_array_object_th_options'+index+option_index}>{option.label}</th>
                                          )
                                      }) : ''
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    form.data && form.data[schema.name] && schema.options ?
                                    form.data[schema.name].map(function (item, child_tr_index) {
                                        return (
                                            <tr key={'div_array_object_tr'+index+child_tr_index}>
                                                {schema.nonAddBtn ? null :
                                                 <td>
                                                     <div className="btn-group btn-group-xs"
                                                         id={schema.name+'-'+child_tr_index+'-array'}>
                                                         <button type="button" className="btn btn-primary btn-lg"
                                                             id={schema.name+'-'+child_tr_index+'-array'}
                                                             onClick={that.removeChild}
                                                             >
                                                    <span className="glyphicon glyphicon-minus"
                                                        aria-hidden="true"></span>
                                                         </button>
                                                     </div>
                                                 </td>
                                                }
                                                {schema.options ?
                                                 schema.options.map(function (opt, opt_index) {
                                                     switch (opt.formType) {
                                                         case 'input':
                                                             return (
                                                                 <td key={'div_array_object_tr_td'+index+child_tr_index+opt_index}>
                                                                     <input type={opt.type}
                                                                         id={schema.name+'-'+child_tr_index+"-"+opt_index+"-"+opt.name}
                                                                         onChange={that.arrayAndObjectChildHandleFunc}
                                                                         className="form-control input-sm"
                                                                         placeholder={opt.placeholder}
                                                                         name={opt.name}
                                                                         type={opt.type}
                                                                         readOnly={opt.readonly?opt.readonly:''}
                                                                         value={item[opt.name]}/>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'select':
                                                             return (
                                                                 <td key={'div_array_object_tr_td'+index+child_tr_index+opt_index}>
                                                                     <select type={opt.type}
                                                                         id={schema.name+'-'+child_tr_index+"-"+opt_index+"-"+opt.name}
                                                                         onChange={that.arrayAndObjectChildHandleFunc}
                                                                         type={opt.type}
                                                                         className="form-control input-sm"
                                                                         name={opt.name} value={item[opt.name]}
                                                                         disabled={ typeof(eval(opt.disabled)) =="function" ? opt.disabled(item[opt.name], item) : false}>
                                                                         { opt.options ?
                                                                           opt.options.map(function (opt_se,
                                                                                                     opt_se_index) {
                                                                               return (
                                                                                   <option value={opt_se.value}
                                                                                       key={'div_array_object_tr_td_opt'+index+child_tr_index+opt_index+opt_se_index}>{opt_se.label}</option>
                                                                               )
                                                                           }) : ''
                                                                         }
                                                                     </select>
                                                                 </td>
                                                             );
                                                             break;
                                                         case 'date':
                                                             return (
                                                                 <td key={'div_array_object_tr_td'+index+child_tr_index+opt_index}>
                                                                     {
                                                                         item[opt.name] ?
                                                                         item[opt.name].format('yyyy-MM-dd hh:mm') : ''
                                                                     }
                                                                 </td>
                                                             );
                                                             break;
                                                     }
                                                 }) : ''
                                                }
                                            </tr>
                                        )
                                    }) : ''
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                break;
            case 'organization':
                return (
                    <div className="form-group " key={'div_organization'+index}>
                        <label className="control-label col-lg-1">{schema.label}</label>

                        <div className="col-lg-5">
                            <table className="table table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th style={{width: 10}}>
                                        <div className="btn-group btn-group-xs" data-id={schema.name}>
                                            <button type="button" className="btn btn-primary btn-lg"
                                                data-id={schema.name} id={schema.name}
                                                onClick={that.openOrganizationModal}>
                                                <span className="glyphicon glyphicon-plus"
                                                    aria-hidden="true"></span>
                                            </button>
                                        </div>
                                    </th>
                                    <th>ÐÕÃû</th>
                                    <th>µç»°</th>
                                </tr>
                                </thead>
                                <tbody>
                                {form.data && form.data[schema.name] ?
                                 form.data[schema.name].map(function (value, child_index) {
                                     let user = Users.findOne({_id: value});
                                     return (
                                         <tr key={'div_organization_tr'+index+child_index}>
                                             <td>
                                                 <div className="btn-group btn-group-xs"
                                                     id={schema.name+'-'+child_index+'-array'}>
                                                     <button type="button" className="btn btn-primary btn-lg"
                                                         id={schema.name+'-'+child_index+'-array'}
                                                         onClick={that.removeChild}>
                                                    <span className="glyphicon glyphicon-minus"
                                                        aria-hidden="true"></span>
                                                     </button>
                                                 </div>
                                             </td>
                                             <td>
                                                 {
                                                     user && user.staff ? user.staff.name : ''
                                                 }
                                             </td>
                                             <td>
                                                 {
                                                     user && user.staff ? user.staff.mobile : ''
                                                 }
                                             </td>
                                         </tr>
                                     )
                                 }) : ''
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
                break;
        }
    },

    importOrganizationModal(form){
        "use strict";
        if (!form.schema) {
            return;
        }
        let isImportOrganization = false;
        _.map(form.schema, function (obj) {
            if (obj.formType === 'organization') {
                isImportOrganization = true;
            }
        });
        if (isImportOrganization) {
            return (
                <OrganizationModal schemaName={this.state.schemaName}
                    onChange={this.organizationSetValue} data={form.data}/>
            )
        }

    },
    render(){
        let form = this.props.form;
        let that = this;
        return (
            <div className="row">
                <div classNameName="col-lg-12">
                    <section className="panel" style={{"marginBottom":0}}>
                        <header className="panel-heading">
                            {form.title ? form.title : ''}
                        </header>
                        <div className="panel-body">
                            <div className="form">
                                <form className="cmxform form-horizontal tasi-form" onKeyDown={this.keyDown}
                                    style={{overflow: 'visible'}}>
                                    <input type="hidden" name="_id" id="_id" value={form.data._id}/>
                                    {form.schema ?
                                     form.schema.map(function (obj, index) {
                                         return that.renderFrom(obj, index);
                                     }) : ''
                                    }
                                    {form.buttons ?
                                     <div className="form-group">
                                         {form.modal ? null : <label className="control-label col-lg-1"></label>}
                                         {
                                             form.buttons.map(function (button, index) {
                                                 return (<button style={{marginLeft:10}} key={'btn'+index}
                                                     className="btn btn-danger"
                                                     onClick={button.fn} id={button.id}>{button.name}</button>)
                                             })
                                         }
                                     </div> : null
                                    }
                                </form>
                                {
                                    form ?
                                    this.importOrganizationModal(form) : null
                                }
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
});
