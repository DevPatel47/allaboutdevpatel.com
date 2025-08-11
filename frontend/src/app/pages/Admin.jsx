import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../services/common/user.service.js';
import IntroductionService from '../services/portfolio/introduction.service.js';
import EducationService from '../services/portfolio/education.service.js';
import ExperienceService from '../services/portfolio/experience.service.js';
import SkillService from '../services/portfolio/skill.service.js';
import ProjectService from '../services/portfolio/project.service.js';
import CertificationService from '../services/portfolio/certification.service.js';
import SocialLinkService from '../services/portfolio/sociallink.service.js';
import TestimonialService from '../services/portfolio/testimonial.service.js';
import { BgImage } from '../components/components.js';
import { Loading } from './pages.js';

const introSvc = IntroductionService;
const eduSvc = EducationService;
const expSvc = ExperienceService;
const skillSvc = SkillService;
const projSvc = ProjectService;
const certSvc = CertificationService;
const socSvc = SocialLinkService;
const testiSvc = TestimonialService;

const TABS = [
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

function textInputProps(extra = '') {
    return `px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${extra}`;
}

function pill() {
    return 'text-[10px] font-mono px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800';
}

function Admin() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [active, setActive] = useState('Introduction');
    const [status, setStatus] = useState('');
    const [intro, setIntro] = useState(null);
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState([]);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [certs, setCerts] = useState([]);
    const [socials, setSocials] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    // Auth check
    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const u = await UserService.getCurrentUser();
                if (u.role !== 'admin') throw new Error('Not admin');
                if (active) setUser(u);
            } catch {
                navigate('/login', { replace: true, state: { from: location.pathname } });
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [navigate, location.pathname]);

    const loadAll = useCallback(async (uid) => {
        try {
            setStatus('Loading data...');
            const [i, edu, exp, skl, prj, c, soc, tst] = await Promise.allSettled([
                introSvc.getByUserId(uid),
                eduSvc.getByUserId(uid),
                expSvc.getByUserId(uid),
                skillSvc.getByUserId(uid),
                projSvc.getByUserId(uid),
                certSvc.getByUserId(uid),
                socSvc.getByUserId(uid),
                testiSvc.getByUserId(uid),
            ]);
            if (i.status === 'fulfilled') setIntro(i.value);
            else setIntro(null);
            if (edu.status === 'fulfilled') setEducation(edu.value);
            if (exp.status === 'fulfilled') setExperience(exp.value);
            if (skl.status === 'fulfilled') setSkills(skl.value);
            if (prj.status === 'fulfilled') setProjects(prj.value);
            if (c.status === 'fulfilled') setCerts(c.value);
            if (soc.status === 'fulfilled') setSocials(soc.value);
            if (tst.status === 'fulfilled') setTestimonials(tst.value);
            setStatus('');
        } catch (e) {
            setStatus(e.message || 'Load error');
        }
    }, []);

    useEffect(() => {
        if (user?._id) loadAll(user._id);
    }, [user, loadAll]);

    if (loading) return <Loading loadingMessage="Checking access..." />;
    if (!user) return null;

    // Helpers
    const submitIntro = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        try {
            setStatus('Saving introduction...');
            const svc = intro ? introSvc.update : introSvc.create;
            const saved = await svc.call(introSvc, user._id, fd);
            setIntro(saved);
            setStatus('Introduction saved');
        } catch (err) {
            setStatus(err.message);
        }
    };

    const createSimple = (setter, list, createFn) => async (payload) => {
        try {
            setStatus('Creating...');
            const created = await createFn(payload);
            setter([created, ...list]);
            setStatus('Created');
        } catch (e) {
            setStatus(e.message);
        }
    };

    const updateReplace = (setter, list, updateFn) => async (id, payload) => {
        try {
            setStatus('Updating...');
            const updated = await updateFn(id, payload);
            setter(list.map((i) => (i._id === updated._id ? updated : i)));
            setStatus('Updated');
        } catch (e) {
            setStatus(e.message);
        }
    };

    const removeItem = (setter, list, delFn) => async (id) => {
        if (!confirm('Delete item?')) return;
        try {
            setStatus('Deleting...');
            await delFn(id);
            setter(list.filter((i) => i._id !== id));
            setStatus('Deleted');
        } catch (e) {
            setStatus(e.message);
        }
    };

    // Creation handlers
    const addEducation = createSimple(setEducation, education, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return await eduSvc.create(user._id, fd);
    });

    const addExperience = createSimple(setExperience, experience, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return await expSvc.create(user._id, fd);
    });

    const addSkill = createSimple(setSkills, skills, async (form) => {
        // backend expects "skills" as comma separated "Name:Level"
        const payload = {
            category: form.category,
            skills: form.skills
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .join(','), // pass through
        };
        const r = await skillSvc.create(user._id, payload);
        return r;
    });

    const addProject = createSimple(setProjects, projects, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return await projSvc.create(user._id, fd);
    });

    const addCert = createSimple(setCerts, certs, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return await certSvc.create(user._id, fd);
    });

    const addSocial = createSimple(setSocials, socials, async (form) => {
        return await socSvc.create(user._id, form);
    });

    const addTestimonial = createSimple(setTestimonials, testimonials, async (form) => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        return await testiSvc.create(user._id, fd);
    });

    // Delete handlers
    const delEducation = removeItem(setEducation, education, (id) => eduSvc.delete(id));
    const delExperience = removeItem(setExperience, experience, (id) => expSvc.delete(id));
    const delSkill = removeItem(setSkills, skills, (id) => skillSvc.delete(id));
    const delProject = removeItem(setProjects, projects, (id) => projSvc.delete(id));
    const delCert = removeItem(setCerts, certs, (id) => certSvc.delete(id));
    const delSocial = removeItem(setSocials, socials, (id) => socSvc.delete(id));
    const delTestimonial = removeItem(setTestimonials, testimonials, (id) => testiSvc.delete(id));

    // Renderers (compact)
    const renderIntro = () => (
        <form onSubmit={submitIntro} className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
                <Field label="Greeting">
                    <input
                        name="greeting"
                        defaultValue={intro?.greeting || ''}
                        className={textInputProps()}
                        required
                    />
                </Field>
                <Field label="Name">
                    <input
                        name="name"
                        defaultValue={intro?.name || ''}
                        className={textInputProps()}
                        required
                    />
                </Field>
                <Field label="Tagline">
                    <input
                        name="tagline"
                        defaultValue={intro?.tagline || ''}
                        className={textInputProps()}
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
                        defaultValue={intro?.description || ''}
                        className={textInputProps()}
                        required
                    />
                </Field>
            </div>
            <button className="self-end px-5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm">
                {intro ? 'Update' : 'Create'}
            </button>
        </form>
    );

    const SimpleCreate = ({ title, fields, onCreate }) => {
        const [open, setOpen] = useState(false);
        const [form, setForm] = useState({});
        return (
            <div className="mb-6">
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="mb-3 text-xs font-mono px-3 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900"
                >
                    {open ? 'Close' : `Add ${title}`}
                </button>
                {open && (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await onCreate(form);
                            setForm({});
                            setOpen(false);
                        }}
                        className="grid md:grid-cols-2 gap-4 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/70"
                    >
                        {fields.map((f) => (
                            <Field key={f.name} label={f.label}>
                                {f.type === 'textarea' ? (
                                    <textarea
                                        rows={f.rows || 3}
                                        value={form[f.name] || ''}
                                        required={f.req}
                                        onChange={(e) =>
                                            setForm({ ...form, [f.name]: e.target.value })
                                        }
                                        className={textInputProps()}
                                        name={f.name}
                                    />
                                ) : f.type === 'file' ? (
                                    <input
                                        type="file"
                                        name={f.name}
                                        onChange={(e) =>
                                            setForm({ ...form, [f.name]: e.target.files[0] })
                                        }
                                        className="text-xs"
                                        required={f.req}
                                        accept={f.accept || '*'}
                                    />
                                ) : (
                                    <input
                                        type={f.type || 'text'}
                                        name={f.name}
                                        value={form[f.name] || ''}
                                        required={f.req}
                                        onChange={(e) =>
                                            setForm({ ...form, [f.name]: e.target.value })
                                        }
                                        className={textInputProps()}
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

    const listCard = (item, lines, onDelete) => (
        <div
            key={item._id}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100/70 dark:bg-zinc-800/60 flex flex-col gap-1"
        >
            {lines.map((l, i) => (
                <div key={i} className="text-xs text-zinc-700 dark:text-zinc-300 break-words">
                    {l}
                </div>
            ))}
            <button
                onClick={() => onDelete(item._id)}
                className="self-end mt-1 text-[10px] px-2 py-1 rounded bg-red-600 text-white"
            >
                Delete
            </button>
        </div>
    );

    const tabBody = () => {
        switch (active) {
            case 'Introduction':
                return renderIntro();
            case 'Education':
                return (
                    <>
                        <SimpleCreate
                            title="Education"
                            onCreate={addEducation}
                            fields={[
                                { name: 'institution', label: 'Institution', req: true },
                                { name: 'degree', label: 'Degree', req: true },
                                { name: 'fieldOfStudy', label: 'Field', req: true },
                                { name: 'startDate', label: 'Start Date', type: 'date', req: true },
                                { name: 'endDate', label: 'End Date', type: 'date' },
                                { name: 'grade', label: 'Grade', req: true },
                                { name: 'logo', label: 'Logo', type: 'file', accept: 'image/*' },
                                {
                                    name: 'description',
                                    label: 'Description',
                                    type: 'textarea',
                                    req: true,
                                },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {education.map((e) =>
                                listCard(
                                    e,
                                    [
                                        `${e.institution} - ${e.degree}`,
                                        `${new Date(e.startDate).toLocaleDateString()} → ${
                                            e.endDate
                                                ? new Date(e.endDate).toLocaleDateString()
                                                : 'Present'
                                        }`,
                                    ],
                                    delEducation,
                                ),
                            )}
                        </div>
                    </>
                );
            case 'Experience':
                return (
                    <>
                        <SimpleCreate
                            title="Experience"
                            onCreate={addExperience}
                            fields={[
                                { name: 'title', label: 'Title', req: true },
                                { name: 'company', label: 'Company', req: true },
                                { name: 'location', label: 'Location', req: true },
                                { name: 'startDate', label: 'Start Date', type: 'date', req: true },
                                { name: 'endDate', label: 'End Date', type: 'date' },
                                {
                                    name: 'responsibilities',
                                    label: 'Responsibilities (comma)',
                                    req: true,
                                    placeholder: 'Design,Build',
                                },
                                {
                                    name: 'techStack',
                                    label: 'Tech Stack (comma)',
                                    req: true,
                                    placeholder: 'React,Node',
                                },
                                { name: 'logo', label: 'Logo', type: 'file', accept: 'image/*' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {experience.map((x) =>
                                listCard(
                                    x,
                                    [
                                        `${x.title} @ ${x.company}`,
                                        `${new Date(x.startDate).toLocaleDateString()} → ${
                                            x.endDate
                                                ? new Date(x.endDate).toLocaleDateString()
                                                : 'Present'
                                        }`,
                                        x.techStack.join(', '),
                                    ],
                                    delExperience,
                                ),
                            )}
                        </div>
                    </>
                );
            case 'Skills':
                return (
                    <>
                        <SimpleCreate
                            title="Skill Group"
                            onCreate={addSkill}
                            fields={[
                                { name: 'category', label: 'Category', req: true },
                                {
                                    name: 'skills',
                                    label: 'Skills Name:Level,...',
                                    req: true,
                                    placeholder: 'HTML:Beginner, CSS:Intermediate',
                                },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {skills.map((s) =>
                                listCard(
                                    s,
                                    [
                                        s.category,
                                        s.skills.map((k) => `${k.name}(${k.level})`).join(', '),
                                    ],
                                    delSkill,
                                ),
                            )}
                        </div>
                    </>
                );
            case 'Projects':
                return (
                    <>
                        <SimpleCreate
                            title="Project"
                            onCreate={addProject}
                            fields={[
                                { name: 'title', label: 'Title', req: true },
                                {
                                    name: 'slug',
                                    label: 'Slug',
                                    req: true,
                                    placeholder: 'unique-slug',
                                },
                                {
                                    name: 'description',
                                    label: 'Description',
                                    type: 'textarea',
                                    req: true,
                                },
                                { name: 'techStack', label: 'Tech Stack (comma)', req: true },
                                { name: 'video', label: 'Video URL', req: true },
                                { name: 'liveLink', label: 'Live Link', req: true },
                                { name: 'repoLink', label: 'Repo Link', req: true },
                                { name: 'tags', label: 'Tags (comma)', req: true },
                                { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {projects.map((p) =>
                                listCard(p, [p.title, p.slug, p.techStack.join(', ')], delProject),
                            )}
                        </div>
                    </>
                );
            case 'Certifications':
                return (
                    <>
                        <SimpleCreate
                            title="Certification"
                            onCreate={addCert}
                            fields={[
                                { name: 'title', label: 'Title', req: true },
                                { name: 'provider', label: 'Provider', req: true },
                                { name: 'issueDate', label: 'Issue Date', type: 'date', req: true },
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
                            {certs.map((c) =>
                                listCard(
                                    c,
                                    [
                                        c.title,
                                        c.provider,
                                        new Date(c.issueDate).toLocaleDateString(),
                                    ],
                                    delCert,
                                ),
                            )}
                        </div>
                    </>
                );
            case 'Social Links':
                return (
                    <>
                        <SimpleCreate
                            title="Social Link"
                            onCreate={addSocial}
                            fields={[
                                { name: 'platform', label: 'Platform', req: true },
                                { name: 'url', label: 'URL', req: true },
                                { name: 'icon', label: 'Icon (optional)' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {socials.map((s) => listCard(s, [s.platform, s.url], delSocial))}
                        </div>
                    </>
                );
            case 'Testimonials':
                return (
                    <>
                        <SimpleCreate
                            title="Testimonial"
                            onCreate={addTestimonial}
                            fields={[
                                { name: 'name', label: 'Name', req: true },
                                { name: 'role', label: 'Role', req: true },
                                { name: 'linkedIn', label: 'LinkedIn' },
                                { name: 'content', label: 'Content', type: 'textarea', req: true },
                                { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
                            ]}
                        />
                        <div className="grid md:grid-cols-2 gap-4">
                            {testimonials.map((t) =>
                                listCard(
                                    t,
                                    [
                                        t.name,
                                        t.role,
                                        t.content.slice(0, 60) +
                                            (t.content.length > 60 ? '...' : ''),
                                    ],
                                    delTestimonial,
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
                            Welcome, {user.username}. Manage portfolio content.
                        </p>
                        <nav className="flex flex-wrap gap-2">
                            {TABS.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActive(t)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono tracking-wide ${
                                        active === t
                                            ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900'
                                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </nav>
                        {status && (
                            <div className="text-[11px] font-mono text-blue-700 dark:text-blue-300">
                                {status}
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
                        {tabBody()}
                    </section>
                </div>
            </main>
        </section>
    );
}

export default Admin;
