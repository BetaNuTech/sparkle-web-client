import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import ActionsIcon from '../../public/icons/ios/actions.svg';
import attachmentModel from '../models/attachment';
import Dropdown, { DropdownLink, DropdownButton } from '../Dropdown';

interface Props {
  attachments?: Array<attachmentModel>;
  onDelete?: (attachment: attachmentModel) => void;
  className?: string;
  // All other props
  [x: string]: any;
}

interface DropdownProps {
  fileUrl: string;
  onDelete: () => void;
}

const DropdownAttachment: FunctionComponent<DropdownProps> = ({
  fileUrl,
  onDelete
}) => (
  <Dropdown>
    <DropdownLink href={fileUrl} target="_blank">
      View
    </DropdownLink>
    <DropdownButton
      type="button"
      onClick={onDelete}
      data-testid="button-delete-attachment"
    >
      Delete
    </DropdownButton>
  </Dropdown>
);

const AttachmentList: FunctionComponent<Props> = ({
  attachments,
  onDelete,
  className,
  ...props
}) => {
  if (attachments.length === 0) {
    return (
      <ul className={clsx(styles.attachment, className)} {...props}>
        <li className={styles.attachment__item}>No Attachments</li>
      </ul>
    );
  }
  return (
    <ul className={clsx(styles.attachment, className)} {...props}>
      {attachments.map((ba) => (
        <li className={styles.attachment__item} key={ba.name}>
          <a href={ba.url} target="_blank" rel="noreferrer">
            {ba.name}
          </a>
          <span className={styles.attachment__dropdown}>
            <ActionsIcon />
            <DropdownAttachment
              fileUrl={ba.url}
              onDelete={() => onDelete(ba)}
            />
          </span>
        </li>
      ))}
    </ul>
  );
};

AttachmentList.defaultProps = {};

export default AttachmentList;
