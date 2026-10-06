import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AppModal } from "./AppModal";

const meta = {
  title: "Overlays/AppModal",
  component: AppModal,
  tags: ["autodocs"],
} satisfies Meta<typeof AppModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function CreateSiteModalPreview() {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ minHeight: 360 }}>
      <Button onClick={() => setOpen(true)} variant="outlined">
        Open Modal
      </Button>

      <AppModal
        onClose={() => setOpen(false)}
        open={open}
        primaryAction={{ label: "Create Site" }}
        secondaryAction={{ label: "Cancel", onClick: () => setOpen(false), variant: "outlined" }}
        steps={{ current: 1, total: 1 }}
        title="Create New Site"
      >
        <Stack spacing={2}>
          <TextField fullWidth label="Site Name" placeholder="Hogwarts" size="small" />
          <TextField fullWidth label="Location" placeholder="123 Main Street" size="small" />
          <Typography color="text.secondary" variant="body2">
            Physical address or general location shown to people.
          </Typography>
        </Stack>
      </AppModal>
    </Box>
  );
}

function MultiStepPreview() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(1);

  const isLastStep = step === 3;

  return (
    <Box sx={{ minHeight: 360 }}>
      <Button
        onClick={() => {
          setStep(1);
          setOpen(true);
        }}
        variant="outlined"
      >
        Open Wizard
      </Button>

      <AppModal
        onClose={() => setOpen(false)}
        open={open}
        primaryAction={{
          label: isLastStep ? "Finish" : "Next",
          onClick: () => {
            if (isLastStep) {
              setOpen(false);
              return;
            }

            setStep((current) => current + 1);
          },
        }}
        secondaryAction={{
          label: step === 1 ? "Cancel" : "Back",
          onClick: () => {
            if (step === 1) {
              setOpen(false);
              return;
            }

            setStep((current) => current - 1);
          },
          variant: "outlined",
        }}
        steps={{ current: step, total: 3 }}
        title="Create New Class"
      >
        <Stack spacing={2}>
          {step === 1 ? (
            <TextField fullWidth label="Class Name" placeholder="Defense Against the Dark Arts" size="small" />
          ) : null}
          {step === 2 ? <TextField fullWidth label="Instructor" placeholder="Professor Lupin" size="small" /> : null}
          {step === 3 ? <TextField fullWidth label="Site" placeholder="Hogwarts" size="small" /> : null}
        </Stack>
      </AppModal>
    </Box>
  );
}

function CustomSectionsPreview() {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ minHeight: 360 }}>
      <Button onClick={() => setOpen(true)} variant="outlined">
        Open Custom Modal
      </Button>

      <AppModal
        footerContent={
          <Stack direction="row" spacing={1.5}>
            <Button onClick={() => setOpen(false)} size="small" variant="outlined">
              Skip
            </Button>
            <Button size="small" variant="contained">
              Save Changes
            </Button>
          </Stack>
        }
        headerContent={
          <Stack spacing={0.5}>
            <Typography variant="h4">Custom Header</Typography>
            <Typography color="text.secondary" variant="body2">
              Header and footer can be fully customized.
            </Typography>
          </Stack>
        }
        onClose={() => setOpen(false)}
        open={open}
        showCloseButton
      >
        <Typography variant="body1">Body content is fully composable.</Typography>
      </AppModal>
    </Box>
  );
}

function FixedHeightsPreview() {
  const [mode, setMode] = useState<"sm" | "md" | "lg">("md");
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ minHeight: 360 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
        <Button onClick={() => {
          setMode("sm");
          setOpen(true);
        }} size="small" variant="outlined">
          Small Height
        </Button>
        <Button onClick={() => {
          setMode("md");
          setOpen(true);
        }} size="small" variant="outlined">
          Medium Height
        </Button>
        <Button onClick={() => {
          setMode("lg");
          setOpen(true);
        }} size="small" variant="outlined">
          Large Height
        </Button>
      </Stack>

      <AppModal
        heightMode={mode}
        onClose={() => setOpen(false)}
        open={open}
        primaryAction={{ label: "Save" }}
        secondaryAction={{ label: "Cancel", onClick: () => setOpen(false), variant: "outlined" }}
        showCloseButton
        size="md"
        title={`Fixed Height (${mode.toUpperCase()})`}
      >
        <Stack spacing={2}>
          <Typography color="text.secondary" variant="body2">
            Demonstrates fixed modal heights via the universal `heightMode` prop.
          </Typography>
          {Array.from({ length: 8 }).map((_, index) => (
            <TextField key={`row-${index + 1}`} fullWidth label={`Field ${index + 1}`} size="small" />
          ))}
        </Stack>
      </AppModal>
    </Box>
  );
}

function BackdropClosePreview() {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ minHeight: 300 }}>
      <Button onClick={() => setOpen(true)} variant="outlined">
        Open Protected Modal
      </Button>

      <AppModal
        disableBackdropClose
        onClose={() => setOpen(false)}
        open={open}
        primaryAction={{ label: "Done", onClick: () => setOpen(false) }}
        showCloseButton
        title="Backdrop Click Disabled"
      >
        <Typography variant="body1">
          Clicking the background will not close this modal. Use the close button or actions.
        </Typography>
      </AppModal>
    </Box>
  );
}

export const CreateSiteForm: Story = {
  args: {
    children: null,
    open: false,
  },
  render: () => <CreateSiteModalPreview />,
};

export const MultiStepWizard: Story = {
  args: {
    children: null,
    open: false,
  },
  render: () => <MultiStepPreview />,
};

export const CustomSections: Story = {
  args: {
    children: null,
    open: false,
  },
  render: () => <CustomSectionsPreview />,
};

export const FixedHeights: Story = {
  args: {
    children: null,
    open: false,
  },
  render: () => <FixedHeightsPreview />,
};

export const DisableBackdropClose: Story = {
  args: {
    children: null,
    open: false,
  },
  render: () => <BackdropClosePreview />,
};
