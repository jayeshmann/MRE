import React from "react";
import { Accordion, Button, Header, Popup } from "semantic-ui-react";
import AddEntryForm, { EntryFormValues } from "./AddEntryForm";

interface AddEntryProps {
  onSubmit: (values: EntryFormValues) => Promise<void>;
  onCancel: () => void;
  activeIndex: number;
}

export const AddEntry: React.FC<AddEntryProps> = ({
  onSubmit,
  onCancel,
  activeIndex,
}) => {
  return (
    <Accordion fluid styled>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={() => onCancel()}
      >
        <Header as="h3">
          <Popup
            content="Add a entry"
            trigger={<Button style={{ fontSize: 20 }} icon="add" />}
            // on={activeIndex === 0 ? "click" : ["hover", "click"]}
            size="small"
            disabled={activeIndex === 0 ? true : false}
          />
          entries
        </Header>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <AddEntryForm onSubmit={onSubmit} onCancel={onCancel} />
      </Accordion.Content>
    </Accordion>
  );
};

export default AddEntry;
