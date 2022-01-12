import { render, screen } from '@testing-library/react';
import Attachment from './index';

describe('Common | Inspection Item Control | Attachment', () => {
  it('should disable when note and photo is false', async () => {
    const props = {
      notes: false,
      photos: false
    };

    render(<Attachment {...props} />);

    const elAttachmentNote = screen.queryByTestId('attachment-note');
    const elAttachmentPhoto = screen.queryByTestId('attachment-photo');

    expect(elAttachmentNote.dataset.test).toEqual('disabled');
    expect(elAttachmentPhoto.dataset.test).toEqual('disabled');
  });

  it('should not disable note element when note property is true', async () => {
    const props = {
      notes: true,
      photos: false
    };

    render(<Attachment {...props} />);

    const elAttachmentNote = screen.queryByTestId('attachment-note');

    expect(elAttachmentNote.dataset.test).toEqual('');
  });

  it('should not disable photo element when photo property is true', async () => {
    const props = {
      notes: false,
      photos: true
    };

    render(<Attachment {...props} />);

    const elAttachmentPhoto = screen.queryByTestId('attachment-photo');

    expect(elAttachmentPhoto.dataset.test).toEqual('');
  });

  // TODO: moved from features/PropertyUpdateInspection/Sections
  // Reable and test that all required classes are added at the top of the next second
  // it('should render notes and attachment icons with deficiency when item has deficient selection', async () => {
  //   const onSectionCollapseToggle = sinon.spy();

  //   const sectionItems = new Map();
  //   sectionItems.set(singleSection.id, [
  //     { ...unselectedCheckmarkItem, mainInputSelection: 1 },
  //     { ...unselectedThumbsItem, mainInputSelection: 1 },
  //     { ...unselectedAbcItem, mainInputSelection: 1 },
  //     { ...unselectedOneToFiveItem, mainInputSelection: 1 },
  //     { ...unselectedCheckedExclaimItem, mainInputSelection: 1 }
  //   ]);

  //   const props = {
  //     sections: [singleSection],
  //     forceVisible: true,
  //     onInputChange: sinon.spy(),
  //     onClickOneActionNotes: sinon.spy(),
  //     onItemIsNAChange: sinon.spy(),
  //     onClickAttachmentNotes: sinon.spy(),
  //     onClickSignatureInput: sinon.spy(),
  //     onClickPhotos: sinon.spy(),
  //     inspectionItemsPhotos: new Map(),
  //     inspectionItemsSignature: new Map(),
  //     sectionItems,
  //     collapsedSections: [],
  //     onAddSection: sinon.spy(),
  //     onRemoveSection: sinon.spy(),
  //     onSectionCollapseToggle,
  //     canEdit: true,
  //     isMobile: false,
  //     completedItems: [],
  //     requireDeficientItemNoteAndPhoto: true,
  //     isIncompleteRevealed: true
  //   };

  //   render(<Sections {...props} />, {
  //     contextWidth: breakpoints.desktop.minWidth
  //   });

  //   // waiting for deficientItemList to be updated in state
  //   await act(async () => {
  //     // need to set timeout in the same way we are doing it in component
  //     const now = Date.now();
  //     const nextSecond = Math.ceil(now / 1000) * 1000;
  //     const timeout = nextSecond - now;
  //     await new Promise((r) => setTimeout(r, timeout));
  //   });

  //   const attachmentNotes = screen.queryAllByTestId('attachment-note');
  //   const attachmentPhotos = screen.queryAllByTestId('attachment-photo');

  //   attachmentNotes.forEach((note) => {
  //     expect(note.dataset.testdeficient).toEqual('deficient');
  //   });

  //   attachmentPhotos.forEach((photo) => {
  //     expect(photo.dataset.testdeficient).toEqual('deficient');
  //   });
  // });
});
