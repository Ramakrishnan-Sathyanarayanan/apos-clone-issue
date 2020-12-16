module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Resource Card',
  construct: function (self, options) {
    options.addFields = options.hasOwnProperty('addFields') ? options.addFields.concat(options.customAddFields(self)) : options.customAddFields(self);
    self.addHelpers({
      getTags: function (tags) {
        var allTags = '';
        try {
          if (typeof tags === 'string' && tags !== '') {
            allTags = tags.split(',').map(function (item) { return item.trim(); }).join(',').replace(/\s/g, '-');
          }
        } catch (e) {
          console.error('Error caught in fw-resource-card getTags helper. Message: ' + e.message);
          return allTags;
        }
        return allTags;
      }
    });
  },
  customAddFields: function (self) {
    return [
      {
        name: 'resource_card_variant',
        label: 'Select resouce card variant',
        type: 'select',
        required: true,
        choices: [
          {
            label: 'Resource card - normal',
            value: 'default',
            showFields: ['new_tab', 'link_href', 'image', 'resource_box_content', 'resource_card_media', 'button', 'modal']
          },
          {
            label: 'Resouce card - Courses',
            value: 'courses',
            showFields: ['new_tab', 'link_href', 'image', 'resource_box_content', 'course_time', 'modal', 'resource_bottom_content']
          }
        ]
      },
      self.apos.fwUtils.aposTypeBoolean('new_tab', 'Should this link open in a new tab?'),
      self.apos.fwUtils.aposTypeBoolean('link_rel', 'Is this a nofollow link?', { help: 'This option will add rel=nofollow in link if set to Yes (for SEO purpose only)', def: false }),
      self.apos.fwUtils.aposTypeString('link_href', 'Specify the Link where it should go', { help: 'Needed only when the resource card opens a link, should be empty when it needs to open a modal' }),
      {
        name: 'image',
        label: 'Placeholder / Resource Card Image',
        type: 'singleton',
        widgetType: 'fw-lazy-image',
        required: true
      },
      {
        name: 'resource_box_content',
        label: 'Resource Box Content',
        type: 'area',
        options: {
          widgets: {
            'apostrophe-rich-text': {
              toolbar: ['Styles', 'Undo', 'Redo', 'Bold', 'Italic', 'BulletedList', 'Link', 'Unlink'],
              styles: self.apos.fwUtils.richTextConfig([
                {
                  name: 'h5 - dark',
                  element: 'h5',
                  attributes: {
                    class: 'resource-heading-dark'
                  }
                },
                'h5',
                'p-with-ellipsis',
                'p-with-ellipsis-gray',
                'p',
                'f-link'
              ])
            }
          }
        }
      },
      {
        name: 'modal',
        label: 'Should this link open a modal?',
        type: 'select',
        def: 'no',
        choices: [{
          label: 'Yes',
          value: 'yes',
          showFields: ['target_modal', 'gated_modal']
        },
        {
          label: 'No',
          value: 'no'
        }
        ]
      },
      self.apos.fwUtils.aposTypeString('target_modal', 'Specify the id of the target modal that needs to open up'),
      {
        name: 'gated_modal',
        label: 'Does the form inside the modal makes resource card gated?',
        help: 'Select yes only if 1: The modal contains a one-time registration form, and 2: Resource card does not contain a gated video.',
        type: 'select',
        def: 'no',
        choices: [{
          label: 'Yes',
          value: 'yes',
          showFields: ['local_storage_key', 'after_gate']
        },
        {
          label: 'No',
          value: 'no'
        }
        ]
      },
      {
        name: 'local_storage_key',
        label: 'Local Storage Key',
        help: 'This is the cookie name that will be set on the user browser. This cookie makes sure user doesnt have to fill the form again on subsequent page loads. eg: fsales_sales_summit',
        type: 'string',
        required: true
      },
      {
        name: 'after_gate',
        label: 'Resource card behaviour after successful registration',
        type: 'select',
        def: 'modal_content',
        choices: [{
          label: 'Show Modal',
          value: 'modal_content',
          showFields: ['target_modal_after_signup']
        },
        {
          label: 'Redirect to a Page',
          value: 'redirect',
          showFields: ['link_href_type', 'is_link_new_tab']
        }]
      },
      self.apos.fwUtils.aposTypeString('target_modal_after_signup', 'Specify the id of the target modal that needs to open up after sign up', { required: true }),
      ...self.apos.fwUtils.aposTypeLink(),
      self.apos.fwUtils.aposTypeString('course_time', 'Specify course duration', { help: 'This field is for courses page (eg: 30 mins)' }),
      {
        name: 'resource_bottom_content',
        label: 'Resource card bottom content',
        type: 'area',
        options: {
          widgets: {
            'fw-button': {},
            'apostrophe-rich-text': {
              toolbar: ['Styles', 'Undo', 'Redo', 'Bold', 'Italic', 'BulletedList'],
              styles: self.apos.fwUtils.richTextConfig([
                {
                  name: 'text inactive',
                  element: 'div',
                  attributes: {
                    class: 'text-inactive'
                  }
                }
              ])
            }
          }
        }
      },
      {
        name: 'filters',
        label: 'Add Filtering criteria to this card',
        help: 'Choose this only if you are using fw-multi-criteria-filter-widget',
        type: 'array',
        titleField: 'fitler_name',
        schema: [
          {
            name: 'filter_type',
            label: 'Type of Filter',
            type: 'select',
            choices: [{
              value: 'dropdown',
              label: 'Dropdown'
            },
            {
              value: 'checkbox',
              label: 'Checkbox'
            }
            ]
          },
          self.apos.fwUtils.aposTypeString('filter_name', 'Filter Name', { help: 'eg: Category' }),
          self.apos.fwUtils.aposTypeString('filter_value', 'Filtering Value', { help: 'eg: CX, Customer Engagement, English, Freshdesk' })
        ]
      },
      self.apos.fwUtils.aposTypeString('filter_tag', 'Enter category name', { help: 'Enter filter tags/category. Use \',\' seperator for multiple filter tags. eg: Activation,Content Marketing' }),
      self.apos.fwUtils.aposTypeString('tag', 'Label for tag', {
        help: 'eg: New'
      }),
      {
        name: 'resource_card_media',
        label: 'Video/Slideshare',
        type: 'area',
        options: {
          widgets: {
            'fw-slideshare': {},
            'fw-video': {}
          },
          limit: 1
        }
      },
      {
        name: 'button',
        label: 'Button',
        type: 'singleton',
        widgetType: 'fw-section-buttons',
        options: {}
      }
    ];
  }
};
