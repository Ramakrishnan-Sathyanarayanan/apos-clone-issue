module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Section - Resource Card',
  construct: function (self, options) {
    self.addHelpers({
      getResourceCardsTags: function (array) {
        var filtersArray = [];
        let filterTags = [];
        try {
          if (array instanceof Array) {
            for (var item of array) {
              if (item.filter_tag) {
                var splittedTagsArray = item.filter_tag.split(',').map(function (item) { return item.trim(); });
                // filtersArray contains tags which may be repeated
                filtersArray = [...filtersArray, ...splittedTagsArray];
              }
            }
            filterTags = self.apos.fwUtils.sortByFrequency(filtersArray);
          }
        } catch (e) {
          console.error('Error caught in fw-section-resource-card getResourceCardsTags helper. Message: ' + e.message);
          return filterTags;
        }
        return filterTags;
      },
      getResourceFilters: function (array) {
        const filtersArray = {
          checkbox: [],
          dropdown: []
        };

        function checkIfAvailableAndGetIndex (arr, name) {
          let count = 0;
          if (arr) {
            for (item of arr) {
              if (item.filter_name === name) {
                return {
                  exist: true,
                  index: count
                };
              }
              count++;
            }
          }
          return {
            exist: false,
            index: -1
          };
        }

        function splitArrayVal (array) {
          return array.split(',').filter(item => item != null && item !== '').map(item => item.trim());
        }

        try {
          if (array instanceof Array) {
            for (var item of array) {
              if (item.filters) {
                for (const filter of item.filters) {
                  const filterValue = splitArrayVal(filter.filter_value);
                  if (filter.filter_type === 'dropdown') {
                    const chechkIffilterAvailable = checkIfAvailableAndGetIndex(filtersArray.dropdown, filter.filter_name);
                    if (chechkIffilterAvailable.exist) {
                      filtersArray.dropdown[chechkIffilterAvailable.index].filter_value.push(...filterValue);
                    } else {
                      filtersArray.dropdown.push({
                        filter_name: filter.filter_name,
                        filter_value: [...filterValue]
                      });
                    }
                  } else if (filter.filter_type === 'checkbox') {
                    const chechkIffilterAvailable = checkIfAvailableAndGetIndex(filtersArray.checkbox, filter.filter_name);
                    if (chechkIffilterAvailable.exist) {
                      filtersArray.checkbox[chechkIffilterAvailable.index].filter_value.push(...filterValue);
                    } else {
                      filtersArray.checkbox.push({
                        filter_name: filter.filter_name,
                        filter_value: [...filterValue]
                      });
                    }
                  }
                }
              }
            }
            for (const item of filtersArray.checkbox) {
              item.filter_value = self.apos.fwUtils.sortByFrequency(item.filter_value);
            }
            for (const item of filtersArray.dropdown) {
              item.filter_value = self.apos.fwUtils.sortByFrequency(item.filter_value);
            }
          }
        } catch (e) {
          console.error('Error caught in fw-section-resource-card getResourceCardsTags helper. Message: ' + e.message);
          return filtersArray;
        }
        return filtersArray;
      }
    });
    const schemaObject = [
      ...self.apos.fwUtils.sectionMeta(),
      {
        name: 'section_header_content',
        label: 'Heading',
        type: 'singleton',
        widgetType: 'apostrophe-rich-text',
        options: {
          toolbar: ['Styles', 'Undo', 'Redo', 'Bold', 'Italic', 'Link'],
          styles: self.apos.fwUtils.richTextConfig([
            'h2',
            {
              name: 'Heading (Centered)',
              element: 'h2',
              attributes: {
                class: 'align-center'
              }
            },
            {
              name: 'Paragraph (Centered)',
              element: 'p',
              attributes: {
                class: 'align-center'
              }
            }
          ])
        }
      },
      self.apos.fwUtils.aposTypeBoolean('heading_align_center', 'Do you want to center align the section heading'),
      self.apos.fwUtils.aposTypeBoolean('align_center', 'Do you want to center align the resource cards? '),
      self.apos.fwUtils.aposTypeBoolean('is_calendar_section', 'Does this section contains calendar update cards? '),
      {
        name: 'is_filter',
        label: 'Does this section contain a filter?',
        type: 'select',
        def: 'no',
        choices: [{
          value: 'no',
          label: 'No'
        },
        {
          value: 'yes',
          label: 'Yes',
          showFields: ['card_filter']
        }
        ]
      },
      {
        name: 'card_filter',
        label: 'Card Filter',
        type: 'area',
        options: {
          widgets: {
            'fw-multi-criteria-filter': {},
            'fw-card-filter': {}
          },
          limit: 1
        }
      },
      {
        name: 'cards_column_count',
        label: 'Choose number of resource cards in a row',
        type: 'select',
        required: true,
        def: '4',
        choices: [
          {
            label: '4',
            value: '4'
          },
          {
            label: '3',
            value: '3'
          }
        ]
      },
      {
        name: 'resource_cards',
        label: 'Resource Cards',
        type: 'area',
        options: {
          widgets: {
            'fw-resource-card': {},
            'fw-calendar-update-card': {},
            'fw-section-buttons': {},
            'fw-image-preview-card': {}
          }
        }
      }
    ];

    options.arrangeFields = options.hasOwnProperty('arrangeFields') ? options.arrangeFields.concat(self.apos.fwUtils.sectionArrangeFields(self.apos.fwUtils.constructNameFieldArray(schemaObject))) : self.apos.fwUtils.sectionArrangeFields(self.apos.fwUtils.constructNameFieldArray(schemaObject));

    options.addFields = options.hasOwnProperty('addFields') ? options.addFields.concat(schemaObject) : schemaObject;
  }
};
