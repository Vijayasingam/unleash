import type { ProjectMode } from '../../hooks/useProjectEnterpriseSettingsForm';
import { useEnvironments } from 'hooks/api/getters/useEnvironments/useEnvironments';
import StickinessIcon from '@mui/icons-material/FormatPaint';
import ProjectModeIcon from '@mui/icons-material/Adjust';
import useUiConfig from 'hooks/api/getters/useUiConfig/useUiConfig';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import EnvironmentsIcon from '@mui/icons-material/CloudCircle';
import { useStickinessOptions } from 'hooks/useStickinessOptions';
import { ReactComponent as ChangeRequestIcon } from 'assets/icons/merge.svg';
import type React from 'react';
import type { ReactNode } from 'react';
import theme from 'themes/theme';
import {
    FormActions,
    OptionButtons,
    ProjectDescriptionContainer,
    ProjectNameContainer,
    StyledDefinitionList,
    StyledForm,
    StyledHeader,
    StyledIcon,
    StyledInput,
    TopGrid,
} from './NewProjectForm.styles';
import { MultiSelectConfigButton } from './ConfigButtons/MultiSelectConfigButton';
import { SingleSelectConfigButton } from './ConfigButtons/SingleSelectConfigButton';
import { ChangeRequestTableConfigButton } from './ConfigButtons/ChangeRequestTableConfigButton';
import { Box, styled } from '@mui/material';

type FormProps = {
    projectId: string;
    projectName: string;
    projectDesc: string;
    projectStickiness: string;
    projectMode: string;
    projectEnvironments: Set<string>;
    projectChangeRequestConfiguration: Record<
        string,
        { requiredApprovals: number }
    >;
    setProjectStickiness: React.Dispatch<React.SetStateAction<string>>;
    setProjectEnvironments: (envs: Set<string>) => void;
    setProjectName: React.Dispatch<React.SetStateAction<string>>;
    setProjectDesc: React.Dispatch<React.SetStateAction<string>>;
    setProjectMode: React.Dispatch<React.SetStateAction<ProjectMode>>;
    updateProjectChangeRequestConfig: {
        disableChangeRequests: (env: string) => void;
        enableChangeRequests: (env: string, requiredApprovals: number) => void;
    };
    handleSubmit: (e: any) => void;
    errors: { [key: string]: string };
    overrideDocumentation: (args: { text: string; icon: ReactNode }) => void;
    clearDocumentationOverride: () => void;
    children?: React.ReactNode;
    Limit?: React.ReactNode;
};

const PROJECT_NAME_INPUT = 'PROJECT_NAME_INPUT';
const PROJECT_DESCRIPTION_INPUT = 'PROJECT_DESCRIPTION_INPUT';

const projectModeOptions = [
    { value: 'open', label: 'open' },
    { value: 'protected', label: 'protected' },
    { value: 'private', label: 'private' },
];

const configButtonData = {
    environments: {
        icon: <EnvironmentsIcon />,
        text: `Each feature flag can have a separate configuration per environment. This setting configures which environments your project should start with.`,
    },
    stickiness: {
        icon: <StickinessIcon />,
        text: 'Stickiness is used to guarantee that your users see the same result when using a gradual rollout. Default stickiness allows you to choose which field is used by default in this project.',
    },
    mode: {
        icon: <ProjectModeIcon />,
        text: "A project's collaboration mode defines who should be allowed see your project and create change requests in it.",
        additionalTooltipContent: (
            <>
                <p>The modes and their functions are:</p>
                <StyledDefinitionList>
                    <dt>Open</dt>
                    <dd>
                        Anyone can see the project and anyone can create change
                        requests.
                    </dd>
                    <dt>Protected</dt>
                    <dd>
                        Anyone can see the project, but only admins and project
                        members can submit change requests.
                    </dd>
                    <dt>Private</dt>
                    <dd>
                        Hides the project from users with the "viewer" root role
                        who are not members of the project. Only project members
                        and admins can submit change requests.
                    </dd>
                </StyledDefinitionList>
            </>
        ),
    },
    changeRequests: {
        icon: <ChangeRequestIcon />,
        text: 'Change requests can be configured per environment and require changes to go through an approval process before being applied.',
    },
};

const LimitContainer = styled(Box)(({ theme }) => ({
    '&:has(*)': {
        padding: theme.spacing(4, 6, 0, 6),
    },
}));

export const NewProjectForm: React.FC<FormProps> = ({
    children,
    Limit,
    handleSubmit,
    projectName,
    projectDesc,
    projectStickiness,
    projectEnvironments,
    projectChangeRequestConfiguration,
    projectMode,
    setProjectMode,
    setProjectEnvironments,
    setProjectName,
    setProjectDesc,
    setProjectStickiness,
    updateProjectChangeRequestConfig,
    errors,
    overrideDocumentation,
    clearDocumentationOverride,
}) => {
    const { isEnterprise } = useUiConfig();
    const { environments: allEnvironments } = useEnvironments();
    const activeEnvironments = allEnvironments.filter((env) => env.enabled);
    const stickinessOptions = useStickinessOptions(projectStickiness);

    const handleProjectNameUpdate = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const input = e.target.value;
        setProjectName(input);
    };

    const numberOfConfiguredChangeRequestEnvironments = Object.keys(
        projectChangeRequestConfiguration,
    ).length;
    const changeRequestSelectorLabel =
        numberOfConfiguredChangeRequestEnvironments > 1
            ? `${numberOfConfiguredChangeRequestEnvironments} environments configured`
            : numberOfConfiguredChangeRequestEnvironments === 1
              ? `1 environment  configured`
              : 'Configure change requests';

    const availableChangeRequestEnvironments = (
        projectEnvironments.size === 0
            ? activeEnvironments
            : activeEnvironments.filter((env) =>
                  projectEnvironments.has(env.name),
              )
    ).map(({ name, type }) => ({ name, type }));

    return (
        <StyledForm
            onSubmit={(submitEvent) => {
                handleSubmit(submitEvent);
            }}
        >
            <TopGrid>
                <StyledIcon aria-hidden='true' />
                <StyledHeader variant='h2'>New project</StyledHeader>
                <ProjectNameContainer>
                    <StyledInput
                        label='Project name'
                        aria-required
                        value={projectName}
                        onChange={handleProjectNameUpdate}
                        error={Boolean(errors.name)}
                        errorText={errors.name}
                        onFocus={() => {
                            delete errors.name;
                        }}
                        data-testid={PROJECT_NAME_INPUT}
                        autoFocus
                        InputProps={{
                            style: { fontSize: theme.typography.h1.fontSize },
                        }}
                        InputLabelProps={{
                            style: { fontSize: theme.typography.h1.fontSize },
                        }}
                        size='medium'
                    />
                </ProjectNameContainer>
                <ProjectDescriptionContainer>
                    <StyledInput
                        size='medium'
                        className='description'
                        label='Description (optional)'
                        multiline
                        maxRows={3}
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        data-testid={PROJECT_DESCRIPTION_INPUT}
                        InputProps={{
                            style: { fontSize: theme.typography.h2.fontSize },
                        }}
                        InputLabelProps={{
                            style: { fontSize: theme.typography.h2.fontSize },
                        }}
                    />
                </ProjectDescriptionContainer>
            </TopGrid>

            <OptionButtons>
                <MultiSelectConfigButton
                    tooltip={{ header: 'Select project environments' }}
                    description={configButtonData.environments.text}
                    selectedOptions={projectEnvironments}
                    options={activeEnvironments.map((env) => ({
                        label: env.name,
                        value: env.name,
                    }))}
                    onChange={setProjectEnvironments}
                    button={{
                        label:
                            projectEnvironments.size > 0
                                ? `${projectEnvironments.size} selected`
                                : 'All environments',
                        labelWidth: `${'all environments'.length}ch`,
                        icon: <EnvironmentsIcon />,
                    }}
                    search={{
                        label: 'Filter project environments',
                        placeholder: 'Select project environments',
                    }}
                    onOpen={() =>
                        overrideDocumentation(configButtonData.environments)
                    }
                    onClose={clearDocumentationOverride}
                />

                <SingleSelectConfigButton
                    tooltip={{ header: 'Set default project stickiness' }}
                    description={configButtonData.stickiness.text}
                    options={stickinessOptions.map(({ key, ...rest }) => ({
                        value: key,
                        ...rest,
                    }))}
                    onChange={(value: any) => {
                        setProjectStickiness(value);
                    }}
                    button={{
                        label: projectStickiness,
                        icon: <StickinessIcon />,
                        labelWidth: '12ch',
                    }}
                    search={{
                        label: 'Filter stickiness options',
                        placeholder: 'Select default stickiness',
                    }}
                    onOpen={() =>
                        overrideDocumentation(configButtonData.stickiness)
                    }
                    onClose={clearDocumentationOverride}
                />

                <ConditionallyRender
                    condition={isEnterprise()}
                    show={
                        <SingleSelectConfigButton
                            tooltip={{
                                header: 'Set project collaboration mode',
                                additionalContent:
                                    configButtonData.mode
                                        .additionalTooltipContent,
                            }}
                            description={configButtonData.mode.text}
                            options={projectModeOptions}
                            onChange={(value: any) => {
                                setProjectMode(value);
                            }}
                            button={{
                                label: projectMode,
                                icon: <ProjectModeIcon />,
                                labelWidth: `${`protected`.length}ch`,
                            }}
                            search={{
                                label: 'Filter project mode options',
                                placeholder: 'Select project mode',
                            }}
                            onOpen={() =>
                                overrideDocumentation(configButtonData.mode)
                            }
                            onClose={clearDocumentationOverride}
                        />
                    }
                />
                <ConditionallyRender
                    condition={isEnterprise()}
                    show={
                        <ChangeRequestTableConfigButton
                            tooltip={{ header: 'Configure change requests' }}
                            description={configButtonData.changeRequests.text}
                            activeEnvironments={
                                availableChangeRequestEnvironments
                            }
                            updateProjectChangeRequestConfiguration={
                                updateProjectChangeRequestConfig
                            }
                            button={{
                                label: changeRequestSelectorLabel,
                                icon: <ChangeRequestIcon />,
                                labelWidth: `${
                                    'nn environments configured'.length
                                }ch`,
                            }}
                            search={{
                                label: 'Filter environments',
                                placeholder: 'Filter environments',
                            }}
                            projectChangeRequestConfiguration={
                                projectChangeRequestConfiguration
                            }
                            onOpen={() =>
                                overrideDocumentation(
                                    configButtonData.changeRequests,
                                )
                            }
                            onClose={clearDocumentationOverride}
                        />
                    }
                />
            </OptionButtons>
            <LimitContainer>{Limit}</LimitContainer>
            <FormActions>{children}</FormActions>
        </StyledForm>
    );
};
