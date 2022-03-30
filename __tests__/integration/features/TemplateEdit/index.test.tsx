import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import { NextRouter } from 'next/router';
import FDBFactory from 'fake-indexeddb/lib/FDBFactory';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { admin } from '../../../../__mocks__/users';
import TemplateModel from '../../../../common/models/template';
import templatesApi from '../../../../common/services/api/templates';
import errorReports from '../../../../common/services/api/errorReports';
import TemplateEdit from '../../../../features/TemplateEdit/index';
import { templateA } from '../../../../__mocks__/templates';
import templateCategories from '../../../../__mocks__/templateCategories';
import stubIntersectionObserver from '../../../helpers/stubIntersectionObserver';
import {
  selectedCheckmarkItem,
  singleSection,
  unselectedThumbsItem
} from '../../../../__mocks__/inspections';
import templateUpdates from '../../../../common/services/indexedDB/templateUpdates';
import wait from '../../../helpers/wait';
import inspectionConfig from '../../../../config/inspections';

const TEMPLATE_TYPES = inspectionConfig.inspectionTemplateTypes;
const INPUT_ITEM_TYPES = Object.keys(TEMPLATE_TYPES);

function withTestRouter(
  tree: React.ReactElement,
  router: Partial<NextRouter> = {}
) {
  const {
    route = '',
    pathname = '',
    query = {},
    asPath = '',
    push = async () => true,
    replace = async () => true,
    reload = () => null,
    back = () => null,
    prefetch = async () => undefined,
    beforePopState = () => null,
    isFallback = false,
    events = {
      on: () => null,
      off: () => null,
      emit: () => null
    }
  } = router;

  return (
    <RouterContext.Provider
      value={{
        route,
        pathname,
        query,
        asPath,
        push,
        replace,
        reload,
        back,
        prefetch,
        beforePopState,
        isFallback,
        events
      }}
    >
      {tree}
    </RouterContext.Provider>
  );
}

describe('Integration | features | Templates', () => {
  afterEach(() => {
    sinon.restore();
  });
  beforeEach(() => {
    sinon.stub(errorReports, 'send').resolves();
    stubIntersectionObserver();
    // Wipe fake Indexed DB
    new FDBFactory(); // eslint-disable-line
    return wait(600);
  });

  it('should request to publish template updates', async () => {
    const update = sinon.stub(templatesApi, 'updateRecord').resolves();
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: { one: { ...selectedCheckmarkItem, sectionId: 'one' } }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: { name: 'Template 1' } as TemplateModel
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'item-values' }
      })
    );

    await act(async () => {
      const saveAction = screen.queryByTestId('StepsLayout-save');
      fireEvent.click(saveAction);
      await waitFor(() => update.called);
    });
    expect(update.called).toBeTruthy();
  });

  it('should create local updates record when any updates are made to the template', async () => {
    const expected = 'Template name 1';
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: { one: { ...selectedCheckmarkItem, sectionId: 'one' } }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'general' }
      })
    );

    await act(async () => {
      const nameInput = screen.queryByTestId('template-edit-name');
      fireEvent.change(nameInput, {
        target: { value: expected }
      });
      await wait(500);
    });

    const localTemplateData = await templateUpdates.queryRecord({
      id: templateA.id
    });

    const id = localTemplateData ? localTemplateData.id : '';
    const name = localTemplateData ? localTemplateData.name : '';
    expect(id).toEqual(templateA.id);
    expect(name).toEqual(expected);
  });

  it('should delete local updates record when changes are reverted', async () => {
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: { one: { ...selectedCheckmarkItem, sectionId: 'one' } }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'general' }
      })
    );

    // add local updates
    await act(async () => {
      const nameInput = screen.queryByTestId('template-edit-name');
      fireEvent.change(nameInput, {
        target: { value: 'Template name 1' }
      });
    });

    let localTemplateData = await templateUpdates.queryRecord({
      id: templateA.id
    });
    expect(localTemplateData.id).toEqual(templateA.id);

    // remove updates
    await act(async () => {
      await wait(100);
      const nameInput = screen.queryByTestId('template-edit-name');
      fireEvent.change(nameInput, {
        target: { value: templateA.name }
      });
      await wait(100);
    });

    localTemplateData = await templateUpdates.queryRecord({
      id: templateA.id
    });
    expect(localTemplateData).toBeUndefined();
  });

  it('should delete selected item on delete button click', async () => {
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: { ...selectedCheckmarkItem, sectionId: 'one', id: 'itemOne' }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 2
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'section-items' }
      })
    );

    await act(async () => {
      const itemCheckbox = screen.queryByTestId('template-edit-item-checkbox');
      const deleteAction = screen.queryByTestId('template-edit-item-delete');
      fireEvent.click(itemCheckbox);

      await wait(100);
      expect(itemCheckbox).toBeChecked();
      fireEvent.click(deleteAction);
      await wait(100);
    });

    const itemCheckbox = screen.queryByTestId('template-edit-item-checkbox');
    expect(itemCheckbox).toBeFalsy();
  });

  it('should show section delete prompt on delete section if section has items', async () => {
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: { ...selectedCheckmarkItem, sectionId: 'one', id: 'itemOne' }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 1
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'sections' }
      })
    );

    await act(async () => {
      await wait(200);
      const itemCheckbox = screen.queryByTestId('template-edit-item-checkbox');
      const deleteAction = screen.queryByTestId('template-edit-section-delete');
      fireEvent.click(itemCheckbox);

      await wait(100);
      expect(itemCheckbox).toBeChecked();
      fireEvent.click(deleteAction);
      await wait(100);
    });

    const deletePrompt = screen.queryByTestId('section-delete-prompt');
    expect(deletePrompt).toBeTruthy();
  });

  it('should delete selected section on delete button click', async () => {
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {}
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 1
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'sections' }
      })
    );

    await act(async () => {
      await wait(200);
      const itemCheckbox = screen.queryByTestId('template-edit-item-checkbox');
      const deleteAction = screen.queryByTestId('template-edit-section-delete');
      fireEvent.click(itemCheckbox);

      await wait(100);
      expect(itemCheckbox).toBeChecked();
      fireEvent.click(deleteAction);
      await wait(200);
    });

    const itemCheckbox = screen.queryByTestId('template-edit-item-checkbox');
    expect(itemCheckbox).toBeFalsy();
  });

  it('should add all types of items to a section', async () => {
    const expected = ['main', 'text_input', 'signature'];

    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: { ...selectedCheckmarkItem, sectionId: 'one', id: 'itemOne' }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 2
    };

    // Link requires rendering inside act
    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'section-items' }
      })
    );

    const actual = [];

    for (let i = 0; i < expected.length; i += 1) {
      const type = expected[i];
      // eslint-disable-next-line
      await act(async () => {
        await wait(100);
        const addAction = screen.queryByTestId(
          `template-edit-add-item-${type}`
        );
        fireEvent.click(addAction);
        await wait(100);
        const templateItems = screen.queryAllByTestId('template-edit-item');
        const addedItem = templateItems[templateItems.length - 1];
        actual.push(addedItem.dataset.itemType);
      });
    }
    expect(actual).toMatchObject(expected);
  });

  it('should add a new section', async () => {
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: { ...selectedCheckmarkItem, sectionId: 'one', id: 'itemOne' }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 1
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'sections' }
      })
    );

    await act(async () => {
      await wait(100);
      const addAction = screen.queryByTestId('template-edit-section-add');
      fireEvent.click(addAction);
      await wait(100);
      const templateItems = screen.queryAllByTestId('template-edit-item');
      expect(templateItems).toHaveLength(2);
    });
  });

  it('should change a main input item score', async () => {
    const expected = 30;
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: {
            ...selectedCheckmarkItem,
            sectionId: 'one',
            id: 'itemOne'
          },
          itemTwo: { ...unselectedThumbsItem, sectionId: 'one', id: 'itemTow' }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 4
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'item-values' }
      })
    );

    await act(async () => {
      await wait(200);
      const cancelIconElement = screen.queryByTestId('control-cancel');
      fireEvent.mouseDown(cancelIconElement);
      await wait(200);
      const selectControl = screen.queryByTestId(
        'template-edit-item-value-select'
      );
      fireEvent.change(selectControl, {
        target: { value: expected }
      });
      await wait(200);
    });

    const localTemplateData = await templateUpdates.queryRecord({
      id: templateA.id
    });
    const actual = localTemplateData.items.itemOne.mainInputOneValue;
    expect(actual).toEqual(expected);
  });

  it('should change item main input type', async () => {
    const expected = Object.values(TEMPLATE_TYPES);
    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: {
            ...selectedCheckmarkItem,
            mainInputType: 'OneAction_notes',
            sectionId: 'one',
            id: 'itemOne'
          }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 3
    };

    render(
      withTestRouter(<TemplateEdit {...props} />, {
        query: { step: 'items' }
      })
    );

    const actual = [];
    // eslint-disable-next-line
    for (const type of INPUT_ITEM_TYPES) {
      // eslint-disable-next-line
      await act(async () => {
        await wait(200);
        let mainInputTypeEl = screen.queryByTestId(
          'template-edit-mainInputType'
        );

        fireEvent.click(mainInputTypeEl);
        await wait(100);
        mainInputTypeEl = screen.queryByTestId('template-edit-mainInputType');
        actual.push(mainInputTypeEl.dataset.mainInputType);
      });
    }
    expect(actual).toMatchObject(expected);
  });

  it('should invalidate sections step when there is not at-least one section with a title', async () => {
    const tests = [
      {
        expected: 'Minimum 1 section is required',
        sections: {},
        unpublishedUpdates: {} as TemplateModel,
        message: 'reveals minimum one section required error label'
      },
      {
        expected: '',
        sections: { one: { ...singleSection, id: 'one' } },
        unpublishedUpdates: {} as TemplateModel,
        message: 'progresses to next step successfully'
      },
      {
        expected: 'Minimum 1 section is required',
        sections: { one: { ...singleSection, id: 'one' } },
        unpublishedUpdates: { sections: { one: null } } as TemplateModel,
        message: 'reveals minimum one section required error label'
      },
      {
        expected: 'Name is required',
        sections: { one: { ...singleSection, title: '', id: 'one' } },
        unpublishedUpdates: {} as TemplateModel,
        message:
          'reveals section title error label when any sections lacks a title'
      }
    ];

    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: {
            ...selectedCheckmarkItem,
            mainInputType: 'OneAction_notes',
            sectionId: 'one',
            id: 'itemOne'
          }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 1
    };

    // eslint-disable-next-line
    for (const test of tests) {
      const { unpublishedUpdates, sections, expected, message } = test;
      const template = { ...props.template, sections } as TemplateModel;
      const updatedProps = { ...props, template, unpublishedUpdates };

      const { unmount } = render(
        withTestRouter(<TemplateEdit {...updatedProps} />, {
          query: { step: 'sections' }
        })
      );

      // eslint-disable-next-line
      await act(async () => {
        await wait(100);
        const nextStepAction = screen.queryByTestId('StepsLayout-next-step');
        fireEvent.click(nextStepAction);
        await wait(1000);
      });

      const miscSectionError = screen.queryByTestId('error-message-sections');
      const sectionError = screen.queryByTestId('error-message-one');
      const miscErrorMsg = miscSectionError ? miscSectionError.textContent : '';
      const sectionErrorMsg = sectionError ? sectionError.textContent : '';
      const actual = `${miscErrorMsg || sectionErrorMsg}`.trim();
      expect(actual, message).toEqual(expected);
      unmount(); // Needed for unpublished updates to sync in next tests
    }
  });

  it('should invalidate section items step once all sections contain at least one titled item', async () => {
    const tests = [
      {
        expected: 'Minimum 1 item required in each section',
        items: {},
        unpublishedUpdates: {} as TemplateModel,
        message: 'disable next step button if there is no items'
      },
      {
        expected: '',
        items: {
          itemOne: {
            ...selectedCheckmarkItem,
            mainInputType: 'OneAction_notes',
            sectionId: 'one',
            id: 'itemOne'
          }
        },
        unpublishedUpdates: {} as TemplateModel,
        message: 'enable next step button'
      },
      {
        expected: 'Minimum 1 item required in each section',
        items: {
          itemOne: {
            ...selectedCheckmarkItem,
            mainInputType: 'OneAction_notes',
            sectionId: 'one',
            id: 'itemOne'
          }
        },
        unpublishedUpdates: { items: { itemOne: null } } as TemplateModel,
        message:
          'disable next step button if local updates removes all items from section'
      }
    ];

    const props = {
      user: admin,
      template: {
        ...templateA,
        sections: { one: { ...singleSection, id: 'one' } },
        items: {
          itemOne: {
            ...selectedCheckmarkItem,
            mainInputType: 'OneAction_notes',
            sectionId: 'one',
            id: 'itemOne'
          }
        }
      },
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      hideBreadcrumbs: true,
      unpublishedUpdates: {} as TemplateModel,
      initialSlide: 2
    };
    // eslint-disable-next-line
    for (const test of tests) {
      const { unpublishedUpdates, items, expected, message } = test;
      const template = { ...props.template, items } as TemplateModel;
      const updatedProps = { ...props, template, unpublishedUpdates };

      const { unmount } = render(
        withTestRouter(<TemplateEdit {...updatedProps} />, {
          query: { step: 'section-items' }
        })
      );

      // eslint-disable-next-line
      await act(async () => {
        await wait(100);
        const nextStepAction = screen.queryByTestId('StepsLayout-next-step');
        fireEvent.click(nextStepAction);
        await wait(500);
      });

      const miscSectionItemError = screen.queryByTestId(
        'error-message-undefined'
      );
      const sectionItemErrorMsg = miscSectionItemError
        ? miscSectionItemError.textContent
        : '';

      const actual = sectionItemErrorMsg.trim();
      expect(actual, message).toEqual(expected);
      unmount(); // Needed for unpublished updates to sync in next tests
    }
  });
});
