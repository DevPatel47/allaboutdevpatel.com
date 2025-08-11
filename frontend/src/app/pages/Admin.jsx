import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../services/common/user.service.js';
import IntroductionService from '../services/portfolio/introduction.service.js';
import EducationService from '../services/portfolio/education.service.js';
import ExperienceService from '../services/portfolio/experience.service.js';
import SkillService from '../services/portfolio/skill.service.js';
import ProjectService from '../services/portfolio/project.service.js';
import CertificationService from '../services/portfolio/certification.service.js';
import SocialLinkService from '../services/portfolio/socialLink.service.js';
import TestimonialService from '../services/portfolio/testimonial.service.js';
import { BgImage } from '../components/components.js';
import { Loading } from './pages.js';

/* Service singletons (exported instances) */
const introductionService = IntroductionService;
const educationService = EducationService;
const experienceService = ExperienceService;
const skillService = SkillService;
const projectService = ProjectService;
const certificationService = CertificationService;
const socialLinkService = SocialLinkService;
const testimonialService = TestimonialService;

const ADMIN_TABS = [
    'Introduction',
    'Education',
    'Experience',
    'Skills',
    'Projects',
    'Certifications',
    'Social Links',
    'Testimonials',
];

function Field({ label, children }) {
    return (
        <label className="flex flex-col gap-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span>{label}</span>
            {children}
        </label>
    );
}

function inputClasses(extra = '') {
    return `px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${extra}`;
}

function Admin() {
    /* Auth / global */
    const [isAuthorizing, setIsAuthorizing] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('Introduction');
    const [globalStatus, setGlobalStatus] = useState('');

    /* Data state */
    const [introduction, setIntroduction] = useState(null);
    const [educationList, setEducationList] = useState([]);
    const [experienceList, setExperienceList] = useState([]);
    const [skillGroups, setSkillGroups] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [certificationList, setCertificationList] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [testimonialList, setTestimonialList] = useState([]);

    /* Edit selection ids */
    const [editEducationId, setEditEducationId] = useState(null);
    const [editExperienceId, setEditExperienceId] = useState(null);
    const [editSkillGroupId, setEditSkillGroupId] = useState(null);
    const [editProjectId, setEditProjectId] = useState(null);
    const [editCertificationId, setEditCertificationId] = useState(null);
    const [editSocialLinkId, setEditSocialLinkId] = useState(null);
    const [editTestimonialId, setEditTestimonialId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    /* Authorization */
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const user = await UserService.getCurrentUser();
                if (user.role !== 'admin') throw new Error('Not authorized');
                if (mounted) setCurrentUser(user);
            } catch {
                navigate('/login', { replace: true, state: { from: location.pathname } });
            } finally {
                if (mounted) setIsAuthorizing(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [navigate, location.pathname]);

    /* Load all content */
    const loadAllContent = useCallback(async (userId) => {
        try {
            setGlobalStatus('Loading data...');
            const [introRes, eduRes, expRes, skillRes, projRes, certRes, socialRes, testiRes] =
                await Promise.allSettled([
                    introductionService.getByUserId(userId),
                    educationService.getByUserId(userId),
                    experienceService.getByUserId(userId),
                    skillService.getByUserId(userId),
                    projectService.getByUserId(userId),
                    certificationService.getByUserId(userId),
                    socialLinkService.getByUserId(userId),
                    testimonialService.getByUserId(userId),
                ]);

            setIntroduction(introRes.status === 'fulfilled' ? introRes.value : null);
            if (eduRes.status === 'fulfilled') setEducationList(eduRes.value);
            if (expRes.status === 'fulfilled') setExperienceList(expRes.value);
            if (skillRes.status === 'fulfilled') setSkillGroups(skillRes.value);
            if (projRes.status === 'fulfilled') setProjectList(projRes.value);
            if (certRes.status === 'fulfilled') setCertificationList(certRes.value);
            if (socialRes.status === 'fulfilled') setSocialLinks(socialRes.value);
            if (testiRes.status === 'fulfilled') setTestimonialList(testiRes.value);

            setGlobalStatus('');
        } catch (e) {
            setGlobalStatus(e.message || 'Load error');
        }
    }, []);

    useEffect(() => {
        if (currentUser?._id) loadAllContent(currentUser._id);
    }, [currentUser, loadAllContent]);

    if (isAuthorizing) return <Loading loadingMessage="Checking access..." />;
    if (!currentUser) return null;

    /* Introduction submit */
    const handleSubmitIntroduction = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            setGlobalStatus('Saving introduction...');
            const method = introduction ? introductionService.update : introductionService.create;
            const saved = await method.call(introductionService, currentUser._id, formData);
            setIntroduction(saved);
            setGlobalStatus('Introduction saved');
        } catch (err) {
            setGlobalStatus(err.message);
        }
    };

    /* Generic helpers */
    const createEntity = (setter, list, createFn) => async (payload) => {
        try {
            setGlobalStatus('Creating...');
            const created = await createFn(payload);
            setter([created, ...list]);
            setGlobalStatus('Created');
        } catch (e) {
            setGlobalStatus(e.message);
        }
    };

    const updateEntity = (setter, list, updateFn) => async (id, payload) => {
        try {
            setGlobalStatus('Updating...');
            const updated = await updateFn(id, payload);
            setter(list.map((item) => (item._id === updated._id ? updated : item)));
            setGlobalStatus('Updated');
        } catch (e) {
            setGlobalStatus(e.message);
        }
    };

    const deleteEntity = (setter, list, deleteFn) => async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            setGlobalStatus('Deleting...');
            await deleteFn(id);
            setter(list.filter((item) => item._id !== id));
            setGlobalStatus('Deleted');
        } catch (e) {
            setGlobalStatus(e.message);
        }
    };

    /* Create handlers */
    const handleCreateEducation = createEntity(setEducationList, educationList, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return educationService.create(currentUser._id, fd);
    });

    const handleCreateExperience = createEntity(setExperienceList, experienceList, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return experienceService.create(currentUser._id, fd);
    });

    const handleCreateSkillGroup = createEntity(setSkillGroups, skillGroups, async (form) => {
        const payload = {
            category: form.category,
            skills: form.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .join(','),
        };
        return skillService.create(currentUser._id, payload);
    });

    const handleCreateProject = createEntity(setProjectList, projectList, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return projectService.create(currentUser._id, fd);
    });

    const handleCreateCertification = createEntity(
        setCertificationList,
        certificationList,
        async (form) => {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
            return certificationService.create(currentUser._id, fd);
        },
    );

    const handleCreateSocialLink = createEntity(setSocialLinks, socialLinks, async (form) =>
        socialLinkService.create(currentUser._id, form),
    );

    const handleCreateTestimonial = createEntity(
        setTestimonialList,
        testimonialList,
        async (form) => {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
            return testimonialService.create(currentUser._id, fd);
        },
    );

    /* Update handlers */
    const handleUpdateEducation = updateEntity(setEducationList, educationList, (id, fd) =>
        educationService.update(id, fd),
    );
    const handleUpdateExperience = updateEntity(setExperienceList, experienceList, (id, fd) =>
        experienceService.update(id, fd),
    );
    const handleUpdateSkillGroup = updateEntity(setSkillGroups, skillGroups, (id, payload) =>
        skillService.update(id, payload),
    );
    const handleUpdateProject = updateEntity(setProjectList, projectList, (id, fd) =>
        projectService.update(id, fd),
    );
    const handleUpdateCertification = updateEntity(
        setCertificationList,
        certificationList,
        (id, fd) => certificationService.update(id, fd),
    );
    const handleUpdateSocialLink = updateEntity(setSocialLinks, socialLinks, (id, payload) =>
        socialLinkService.update(id, payload),
    );
    const handleUpdateTestimonial = updateEntity(setTestimonialList, testimonialList, (id, fd) =>
        testimonialService.update(id, fd),
    );

    /* Delete handlers */
    const handleDeleteEducation = deleteEntity(setEducationList, educationList, (id) =>
        educationService.delete(id),
    );
    const handleDeleteExperience = deleteEntity(setExperienceList, experienceList, (id) =>
        experienceService.delete(id),
    );
    const handleDeleteSkillGroup = deleteEntity(setSkillGroups, skillGroups, (id) =>
        skillService.delete(id),
    );
    const handleDeleteProject = deleteEntity(setProjectList, projectList, (id) =>
        projectService.delete(id),
    );
    const handleDeleteCertification = deleteEntity(setCertificationList, certificationList, (id) =>
        certificationService.delete(id),
    );
    const handleDeleteSocialLink = deleteEntity(setSocialLinks, socialLinks, (id) =>
        socialLinkService.delete(id),
    );
    const handleDeleteTestimonial = deleteEntity(setTestimonialList, testimonialList, (id) =>
        testimonialService.delete(id),
    );

    /* Reusable create form */
    const CreateSection = ({ label, fields, onCreate }) => {
        const [open, setOpen] = useState(false);
        const [formState, setFormState] = useState({});
        return (
            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="mb-3 text-xs font-mono px-3 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900"
                >
                    {open ? 'Close' : `Add ${label}`}
                </button>
                {open && (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await onCreate(formState);
                            setFormState({});
                            setOpen(false);
                        }}
                        className="grid md:grid-cols-2 gap-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/70"
                    >
                        {fields.map((f) => (
                            <Field key={f.name} label={f.label}>
                                {f.type === 'textarea' ? (
                                    <textarea
                                        rows={f.rows || 3}
                                        value={formState[f.name] || ''}
                                        required={f.required}
                                        onChange={(e) =>
                                            setFormState({ ...formState, [f.name]: e.target.value })
                                        }
                                        className={inputClasses()}
                                        name={f.name}
                                    />
                                ) : f.type === 'file' ? (
                                    <input
                                        type="file"
                                        name={f.name}
                                        onChange={(e) =>
                                            setFormState({
                                                ...formState,
                                                [f.name]: e.target.files[0],
                                            })
                                        }
                                        className="text-xs"
                                        required={f.required}
                                        accept={f.accept || '*'}
                                    />
                                ) : (
                                    <input
                                        type={f.type || 'text'}
                                        name={f.name}
                                        value={formState[f.name] || ''}
                                        required={f.required}
                                        onChange={(e) =>
                                            setFormState({ ...formState, [f.name]: e.target.value })
                                        }
                                        className={inputClasses()}
                                        placeholder={f.placeholder}
                                    />
                                )}
                            </Field>
                        ))}
                        <div className="md:col-span-2 flex justify-end">
                            <button className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm">
                                Create
                            </button>
                        </div>
                    </form>
                )}
            </div>
        );
    };

    /* Inline edit row */
    const EditRow = ({ fields, entity, onCancel, onSave, hasFile = false }) => {
        const [formState, setFormState] = useState(() => {
            const base = {};
            fields.forEach((f) => {
                base[f.name] = f.type === 'file' ? null : entity[f.name] ?? '';
            });
            return base;
        });

        return (
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    let payload;
                    if (hasFile) {
                        payload = new FormData();
                        Object.entries(formState).forEach(([k, v]) => {
                            if (v !== null && v !== '') payload.append(k, v);
                        });
                    } else {
                        payload = formState;
                    }
                    await onSave(entity._id, payload);
                    onCancel();
                }}
                className="flex flex-col gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/60"
            >
                <div className="grid md:grid-cols-2 gap-4">
                    {fields.map((f) => (
                        <Field key={f.name} label={f.label}>
                            {f.type === 'textarea' ? (
                                <textarea
                                    rows={f.rows || 3}
                                    value={formState[f.name] || ''}
                                    onChange={(e) =>
                                        setFormState({ ...formState, [f.name]: e.target.value })
                                    }
                                    className={inputClasses()}
                                />
                            ) : f.type === 'file' ? (
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setFormState({ ...formState, [f.name]: e.target.files[0] })
                                    }
                                    className="text-xs"
                                    accept={f.accept || '*'}
                                />
                            ) : f.type === 'date' ? (
                                <input
                                    type="date"
                                    value={(formState[f.name] || '').slice(0, 10)}
                                    onChange={(e) =>
                                        setFormState({ ...formState, [f.name]: e.target.value })
                                    }
                                    className={inputClasses()}
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={formState[f.name] || ''}
                                    onChange={(e) =>
                                        setFormState({ ...formState, [f.name]: e.target.value })
                                    }
                                    className={inputClasses()}
                                />
                            )}
                        </Field>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-xs bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs"
                    >
                        Save
                    </button>
                </div>
            </form>
        );
    };

    /* Display card */
    const EntityCard = ({ entity, lines, onDelete, onBeginEdit }) => (
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100/70 dark:bg-zinc-800/60 flex flex-col gap-2">
            {lines.map((text, i) => (
                <div key={i} className="text-xs text-zinc-700 dark:text-zinc-300 break-words">
                    {text}
                </div>
            ))}
            <div className="flex gap-2 self-end">
                {onBeginEdit && (
                    <button
                        onClick={onBeginEdit}
                        className="text-[10px] px-2 py-1 rounded bg-amber-500 text-white"
                    >
                        Edit
                    </button>
                )}
                <button
                    onClick={onDelete}
                    className="text-[10px] px-2 py-1 rounded bg-red-600 text-white"
                >
                    Delete
                </button>
            </div>
        </div>
    );

    /* Tab content */
    const renderTabBody = () => {
        switch (activeTab) {
            case 'Introduction':
                return (
                    <form onSubmit={handleSubmitIntroduction} className="flex flex-col gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Field label="Greeting">
                                <input
                                    name="greeting"
                                    defaultValue={introduction?.greeting || ''}
                                    className={inputClasses()}
                                    required
                                />
                            </Field>
                            <Field label="Name">
                                <input
                                    name="name"
                                    defaultValue={introduction?.name || ''}
                                    className={inputClasses()}
                                    required
                                />
                            </Field>
                            <Field label="Tagline">
                                <input
                                    name="tagline"
                                    defaultValue={introduction?.tagline || ''}
                                    className={inputClasses()}
                                    required
                                />
                            </Field>
                            <Field label="Profile Image (file)">
                                <input type="file" name="profileImage" className="text-xs" />
                            </Field>
                            <Field label="Resume (file)">
                                <input type="file" name="resume" className="text-xs" />
                            </Field>
                            <Field label="Description">
                                <textarea
                                    name="description"
                                    rows="4"
                                    defaultValue={introduction?.description || ''}
                                    className={inputClasses()}
                                    required
                                />
                            </Field>
                        </div>
                        <button className="self-end px-5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm">
                            {introduction ? 'Update' : 'Create'}
                        </button>
                    </form>
                );

            case 'Education':
                return (
                    <>
                        <CreateSection
                            label="Education"
                            onCreate={handleCreateEducation}
                            fields={[
                                { name: 'institution', label: 'Institution', required: true },
                                { name: 'degree', label: 'Degree', required: true },
                                { name: 'fieldOfStudy', label: 'Field', required: true },
                                {
                                    name: 'startDate',
                                    label: 'Start Date',
                                    type: 'date',
                                    required: true,
                                },
                                { name: 'endDate', label: 'End Date', type: 'date' },
                                { name: 'grade', label: 'Grade', required: true },
                                { name: 'logo', label: 'Logo', type: 'file', accept: 'image/*' },
                                {
                                    name: 'description',
                                    label: 'Description',
                                    type: 'textarea',
                                    required: true,
                                },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {educationList.map((item) =>
                                item._id === editEducationId ? (
                                    <EditRow
                                        key={item._id}
                                        entity={item}
                                        onCancel={() => setEditEducationId(null)}
                                        onSave={async (id, payload) => {
                                            if (!(payload instanceof FormData)) {
                                                const fd = new FormData();
                                                Object.entries(payload).forEach(([k, v]) =>
                                                    fd.append(k, v),
                                                );
                                                payload = fd;
                                            }
                                            await handleUpdateEducation(id, payload);
                                        }}
                                        hasFile
                                        fields={[
                                            { name: 'institution', label: 'Institution' },
                                            { name: 'degree', label: 'Degree' },
                                            { name: 'fieldOfStudy', label: 'Field' },
                                            {
                                                name: 'startDate',
                                                label: 'Start Date',
                                                type: 'date',
                                            },
                                            { name: 'endDate', label: 'End Date', type: 'date' },
                                            { name: 'grade', label: 'Grade' },
                                            {
                                                name: 'logo',
                                                label: 'Logo',
                                                type: 'file',
                                                accept: 'image/*',
                                            },
                                            {
                                                name: 'description',
                                                label: 'Description',
                                                type: 'textarea',
                                            },
                                        ]}
                                    />
                                ) : (
                                    <EntityCard
                                        key={item._id}
                                        entity={item}
                                        lines={[
                                            `${item.institution} - ${item.degree}`,
                                            `${new Date(item.startDate).toLocaleDateString()} → ${
                                                item.endDate
                                                    ? new Date(item.endDate).toLocaleDateString()
                                                    : 'Present'
                                            }`,
                                        ]}
                                        onDelete={() => handleDeleteEducation(item._id)}
                                        onBeginEdit={() => setEditEducationId(item._id)}
                                    />
                                ),
                            )}
                        </div>
                    </>
                );

            case 'Experience':
                return (
                    <>
                        <CreateSection
                            label="Experience"
                            onCreate={handleCreateExperience}
                            fields={[
                                { name: 'title', label: 'Title', required: true },
                                { name: 'company', label: 'Company', required: true },
                                { name: 'location', label: 'Location', required: true },
                                {
                                    name: 'startDate',
                                    label: 'Start Date',
                                    type: 'date',
                                    required: true,
                                },
                                { name: 'endDate', label: 'End Date', type: 'date' },
                                {
                                    name: 'responsibilities',
                                    label: 'Responsibilities (comma)',
                                    required: true,
                                    placeholder: 'Design,Build',
                                },
                                {
                                    name: 'techStack',
                                    label: 'Tech Stack (comma)',
                                    required: true,
                                    placeholder: 'React,Node',
                                },
                                { name: 'logo', label: 'Logo', type: 'file', accept: 'image/*' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {experienceList.map((item) =>
                                item._id === editExperienceId ? (
                                    <EditRow
                                        key={item._id}
                                        entity={item}
                                        onCancel={() => setEditExperienceId(null)}
                                        onSave={async (id, payload) => {
                                            if (!(payload instanceof FormData)) {
                                                const fd = new FormData();
                                                Object.entries(payload).forEach(([k, v]) =>
                                                    fd.append(k, v),
                                                );
                                                payload = fd;
                                            }
                                            await handleUpdateExperience(id, payload);
                                        }}
                                        hasFile
                                        fields={[
                                            { name: 'title', label: 'Title' },
                                            { name: 'company', label: 'Company' },
                                            { name: 'location', label: 'Location' },
                                            {
                                                name: 'startDate',
                                                label: 'Start Date',
                                                type: 'date',
                                            },
                                            { name: 'endDate', label: 'End Date', type: 'date' },
                                            {
                                                name: 'responsibilities',
                                                label: 'Responsibilities',
                                                type: 'textarea',
                                            },
                                            { name: 'techStack', label: 'Tech Stack' },
                                            {
                                                name: 'logo',
                                                label: 'Logo',
                                                type: 'file',
                                                accept: 'image/*',
                                            },
                                        ]}
                                    />
                                ) : (
                                    <EntityCard
                                        key={item._id}
                                        entity={item}
                                        lines={[
                                            `${item.title} @ ${item.company}`,
                                            `${new Date(item.startDate).toLocaleDateString()} → ${
                                                item.endDate
                                                    ? new Date(item.endDate).toLocaleDateString()
                                                    : 'Present'
                                            }`,
                                            item.techStack.join(', '),
                                        ]}
                                        onDelete={() => handleDeleteExperience(item._id)}
                                        onBeginEdit={() => setEditExperienceId(item._id)}
                                    />
                                ),
                            )}
                        </div>
                    </>
                );

            case 'Skills':
                return (
                    <>
                        <CreateSection
                            label="Skill Group"
                            onCreate={handleCreateSkillGroup}
                            fields={[
                                { name: 'category', label: 'Category', required: true },
                                {
                                    name: 'skills',
                                    label: 'Skills Name:Level,...',
                                    required: true,
                                    placeholder: 'HTML:Beginner, CSS:Intermediate',
                                },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {skillGroups.map((group) =>
                                group._id === editSkillGroupId ? (
                                    <EditRow
                                        key={group._id}
                                        entity={{
                                            ...group,
                                            skills: group.skills
                                                .map((s) => `${s.name}:${s.level}`)
                                                .join(', '),
                                        }}
                                        onCancel={() => setEditSkillGroupId(null)}
                                        onSave={async (id, payload) => {
                                            await handleUpdateSkillGroup(id, {
                                                category: payload.category,
                                                skills: payload.skills,
                                            });
                                        }}
                                        fields={[
                                            { name: 'category', label: 'Category' },
                                            {
                                                name: 'skills',
                                                label: 'Skills Name:Level,...',
                                                type: 'textarea',
                                            },
                                        ]}
                                    />
                                ) : (
                                    <EntityCard
                                        key={group._id}
                                        entity={group}
                                        lines={[
                                            group.category,
                                            group.skills
                                                .map((s) => `${s.name}(${s.level})`)
                                                .join(', '),
                                        ]}
                                        onDelete={() => handleDeleteSkillGroup(group._id)}
                                        onBeginEdit={() => setEditSkillGroupId(group._id)}
                                    />
                                ),
                            )}
                        </div>
                    </>
                );

            case 'Projects':
                return (
                    <>
                        <CreateSection
                            label="Project"
                            onCreate={handleCreateProject}
                            fields={[
                                { name: 'title', label: 'Title', required: true },
                                {
                                    name: 'slug',
                                    label: 'Slug',
                                    required: true,
                                    placeholder: 'unique-slug',
                                },
                                {
                                    name: 'description',
                                    label: 'Description',
                                    type: 'textarea',
                                    required: true,
                                },
                                { name: 'techStack', label: 'Tech Stack (comma)', required: true },
                                { name: 'video', label: 'Video URL', required: true },
                                { name: 'liveLink', label: 'Live Link', required: true },
                                { name: 'repoLink', label: 'Repo Link', required: true },
                                { name: 'tags', label: 'Tags (comma)', required: true },
                                { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {projectList.map((project) =>
                                project._id === editProjectId ? (
                                    <EditRow
                                        key={project._id}
                                        entity={{
                                            ...project,
                                            techStack: project.techStack.join(', '),
                                            tags: project.tags.join(', '),
                                        }}
                                        onCancel={() => setEditProjectId(null)}
                                        onSave={async (id, payload) => {
                                            if (!(payload instanceof FormData)) {
                                                const fd = new FormData();
                                                Object.entries(payload).forEach(([k, v]) =>
                                                    fd.append(k, v),
                                                );
                                                payload = fd;
                                            }
                                            await handleUpdateProject(id, payload);
                                        }}
                                        hasFile
                                        fields={[
                                            { name: 'title', label: 'Title' },
                                            { name: 'slug', label: 'Slug' },
                                            {
                                                name: 'description',
                                                label: 'Description',
                                                type: 'textarea',
                                            },
                                            { name: 'techStack', label: 'Tech Stack (comma)' },
                                            { name: 'video', label: 'Video URL' },
                                            { name: 'liveLink', label: 'Live Link' },
                                            { name: 'repoLink', label: 'Repo Link' },
                                            { name: 'tags', label: 'Tags (comma)' },
                                            {
                                                name: 'image',
                                                label: 'Image',
                                                type: 'file',
                                                accept: 'image/*',
                                            },
                                        ]}
                                    />
                                ) : (
                                    <EntityCard
                                        key={project._id}
                                        entity={project}
                                        lines={[
                                            project.title,
                                            project.slug,
                                            project.techStack.join(', '),
                                        ]}
                                        onDelete={() => handleDeleteProject(project._id)}
                                        onBeginEdit={() => setEditProjectId(project._id)}
                                    />
                                ),
                            )}
                        </div>
                    </>
                );

            case 'Certifications':
                return (
                    <>
                        <CreateSection
                            label="Certification"
                            onCreate={handleCreateCertification}
                            fields={[
                                { name: 'title', label: 'Title', required: true },
                                { name: 'provider', label: 'Provider', required: true },
                                {
                                    name: 'issueDate',
                                    label: 'Issue Date',
                                    type: 'date',
                                    required: true,
                                },
                                { name: 'credentialId', label: 'Credential ID' },
                                { name: 'credentialUrl', label: 'Credential URL' },
                                {
                                    name: 'badgeImage',
                                    label: 'Badge Image',
                                    type: 'file',
                                    accept: 'image/*',
                                },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {certificationList.map((cert) =>
                                cert._id === editCertificationId ? (
                                    <EditRow
                                        key={cert._id}
                                        entity={cert}
                                        onCancel={() => setEditCertificationId(null)}
                                        onSave={async (id, payload) => {
                                            if (!(payload instanceof FormData)) {
                                                const fd = new FormData();
                                                Object.entries(payload).forEach(([k, v]) =>
                                                    fd.append(k, v),
                                                );
                                                payload = fd;
                                            }
                                            await handleUpdateCertification(id, payload);
                                        }}
                                        hasFile
                                        fields={[
                                            { name: 'title', label: 'Title' },
                                            { name: 'provider', label: 'Provider' },
                                            {
                                                name: 'issueDate',
                                                label: 'Issue Date',
                                                type: 'date',
                                            },
                                            { name: 'credentialId', label: 'Credential ID' },
                                            { name: 'credentialUrl', label: 'Credential URL' },
                                            {
                                                name: 'badgeImage',
                                                label: 'Badge Image',
                                                type: 'file',
                                                accept: 'image/*',
                                            },
                                        ]}
                                    />
                                ) : (
                                    <EntityCard
                                        key={cert._id}
                                        entity={cert}
                                        lines={[
                                            cert.title,
                                            cert.provider,
                                            new Date(cert.issueDate).toLocaleDateString(),
                                        ]}
                                        onDelete={() => handleDeleteCertification(cert._id)}
                                        onBeginEdit={() => setEditCertificationId(cert._id)}
                                    />
                                ),
                            )}
                        </div>
                    </>
                );

            case 'Social Links':
                return (
                    <>
                        <CreateSection
                            label="Social Link"
                            onCreate={handleCreateSocialLink}
                            fields={[
                                { name: 'platform', label: 'Platform', required: true },
                                { name: 'url', label: 'URL', required: true },
                                { name: 'icon', label: 'Icon' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {socialLinks.map((link) =>
                                link._id === editSocialLinkId ? (
                                    <EditRow
                                        key={link._id}
                                        entity={link}
                                        onCancel={() => setEditSocialLinkId(null)}
                                        onSave={handleUpdateSocialLink}
                                        fields={[
                                            { name: 'platform', label: 'Platform' },
                                            { name: 'url', label: 'URL' },
                                            { name: 'icon', label: 'Icon' },
                                        ]}
                                    />
                                ) : (
                                    <EntityCard
                                        key={link._id}
                                        entity={link}
                                        lines={[link.platform, link.url]}
                                        onDelete={() => handleDeleteSocialLink(link._id)}
                                        onBeginEdit={() => setEditSocialLinkId(link._id)}
                                    />
                                ),
                            )}
                        </div>
                    </>
                );

            case 'Testimonials':
                return (
                    <>
                        <CreateSection
                            label="Testimonial"
                            onCreate={handleCreateTestimonial}
                            fields={[
                                { name: 'name', label: 'Name', required: true },
                                { name: 'role', label: 'Role', required: true },
                                { name: 'linkedIn', label: 'LinkedIn' },
                                {
                                    name: 'content',
                                    label: 'Content',
                                    type: 'textarea',
                                    required: true,
                                },
                                { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {testimonialList.map((t) =>
                                t._id === editTestimonialId ? (
                                    <EditRow
                                        key={t._id}
                                        entity={t}
                                        onCancel={() => setEditTestimonialId(null)}
                                        onSave={async (id, payload) => {
                                            if (!(payload instanceof FormData)) {
                                                const fd = new FormData();
                                                Object.entries(payload).forEach(([k, v]) =>
                                                    fd.append(k, v),
                                                );
                                                payload = fd;
                                            }
                                            await handleUpdateTestimonial(id, payload);
                                        }}
                                        hasFile
                                        fields={[
                                            { name: 'name', label: 'Name' },
                                            { name: 'role', label: 'Role' },
                                            { name: 'linkedIn', label: 'LinkedIn' },
                                            { name: 'content', label: 'Content', type: 'textarea' },
                                            {
                                                name: 'image',
                                                label: 'Image',
                                                type: 'file',
                                                accept: 'image/*',
                                            },
                                        ]}
                                    />
                                ) : (
                                    <EntityCard
                                        key={t._id}
                                        entity={t}
                                        lines={[
                                            t.name,
                                            t.role,
                                            t.content.slice(0, 60) +
                                                (t.content.length > 60 ? '...' : ''),
                                        ]}
                                        onDelete={() => handleDeleteTestimonial(t._id)}
                                        onBeginEdit={() => setEditTestimonialId(t._id)}
                                    />
                                ),
                            )}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <section className="relative z-10 border-b-8 border-zinc-200 dark:border-zinc-800">
            <BgImage />
            <main
                className="
                    w-full flex items-start justify-center
                    bg-zinc-50 dark:bg-zinc-950/80
                    min-h-screen px-4 pt-32 pb-32 relative overflow-hidden
                "
                aria-label="Admin Page"
            >
                <div className="relative z-0 w-full max-w-6xl flex flex-col gap-6">
                    <header
                        className="
                            rounded-3xl border border-zinc-200 dark:border-zinc-800
                            bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200
                            dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900
                            shadow-xl p-6 flex flex-col gap-4
                        "
                    >
                        <h1 className="text-3xl md:text-4xl font-extrabold font-poiret tracking-tight text-zinc-900 dark:text-zinc-50">
                            Admin Dashboard
                        </h1>
                        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                            Welcome, {currentUser.username}. Manage portfolio content.
                        </p>
                        <nav className="flex flex-wrap gap-2">
                            {ADMIN_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide ${
                                        activeTab === tab
                                            ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900'
                                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        {globalStatus && (
                            <div className="text-[11px] font-mono text-blue-700 dark:text-blue-300">
                                {globalStatus}
                            </div>
                        )}
                    </header>

                    <section
                        className="
                            rounded-3xl border border-zinc-200 dark:border-zinc-800
                            bg-zinc-100/70 dark:bg-zinc-900/70 p-6 flex flex-col gap-6
                            shadow-md
                        "
                    >
                        {renderTabBody()}
                    </section>
                </div>
            </main>
        </section>
    );
}

export default Admin;
