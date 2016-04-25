# reactAutoForm
This is a demo, waiting to continue to develop

#demo

``` js
const demo = React.createClass({
 getInitialState: function () {
        return {

            data: {}
        };
    },
  renderBody(){
        let that = this;
        let option = [{label: '', value: ''}];
        let form = {
            title: 'demo',
            buttons: [
                {
                    id: 'saveBtn',
                    name: '提交保存',
                    fn: function (event) {

                        that.insert(event);
                    }
                }
            ],
            schema: [
                {
                    name: 'demo',
                    formType: 'input',
                    type: 'text',
                    label: "demo",
                    placeholder: 'demo'
                },

                {
                    name: 'mode',
                    type: 'text',
                    formType: 'select',
                    label: 'demo',
                    options: [
                        {label: '', value: ''},
                        {label: 'one', value: '1'},
                        {label: 'two', value: '2'}
                    ]
                }
                {
                    name: 'size.xxs',
                    type: 'number',
                    formType: 'input',
                    label: 'XXSnumber'
                },
                {
                    name: 'description',
                    type: 'text',
                    formType: 'textarea',
                    label: 'description'
                },
                {
                    name: 'style',
                    type: 'text',
                    formType: 'array',
                    label: 'demo',
                    model: 'checkbox',
                    options: ["1","2","3"]
                }
                  ，
                {
                    name: 'lease_type',
                    type: 'text',
                    formType: 'array',
                    label: '租赁方式',
                    model: 'checkbox',
                    options: [
                        {label: 'one', value: '1'},
                        {label: 'one', value: '2'}
                    ]
                },
                {
                    name: 'keywords',
                    type: 'text',
                    formType: 'array',
                    label: 'demo'
                }
            ],
            data: this.state.data
        };
})
```