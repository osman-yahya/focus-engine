--
-- PostgreSQL database dump
--

\restrict RThs317OwdlfQmjE5cTjzy6BNfVVJfRmx541T3cJBTDRDjPmSnxU7r8heINH7Tr

-- Dumped from database version 15.17
-- Dumped by pg_dump version 15.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Admin" (
    id text NOT NULL,
    username text NOT NULL,
    "passwordHash" text NOT NULL,
    role text DEFAULT 'ADMIN'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: CrawlJob; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CrawlJob" (
    id text NOT NULL,
    url text NOT NULL,
    depth integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'QUEUED'::text NOT NULL,
    "errorLog" text,
    "rootUrl" text,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Document" (
    id text NOT NULL,
    url text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    keywords text NOT NULL,
    "textContent" text NOT NULL,
    "indexedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Setting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Setting" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL
);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Admin" (id, username, "passwordHash", role, "createdAt") FROM stdin;
4b6563e1-bf61-4b5d-a41b-4e611a90c782	admin	$2b$10$24fEPFyEDxlfaE69sZxYK.A4nNq8wYf.X7fa2cXFEPs1K8MDPK0ku	ADMIN	2026-03-24 15:08:54.494
\.


--
-- Data for Name: CrawlJob; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CrawlJob" (id, url, depth, status, "errorLog", "rootUrl", "parentId", "createdAt", "updatedAt") FROM stdin;
1a7a1794-2f38-4028-9a77-1f79f49f0b38	http://akademi.itu.edu.tr/sahinyu/Duyurular	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.844	2026-03-24 15:09:37.751
8eb1607e-81e2-44bf-acc6-ec07ba3fdc6a	http://akademi.itu.edu.tr/sahinyu/Edit%C3%B6rl%C3%BCk	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.84	2026-03-24 15:09:37.752
24f1eca2-35cf-4201-b962-eced8131c4a0	http://akademi.itu.edu.tr/sahinyu/Etkinlikler	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.842	2026-03-24 15:09:37.753
3880acdc-79ab-4f60-b356-048cd558a0bd	https://akademi.itu.edu.tr/fakulte-enstitu/43/Bilgisayar	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.846	2026-03-24 15:09:38.258
e3ab37e3-df70-4dd7-a585-4b94e714b098	https://akademi.itu.edu.tr/sahinyu/	1	ACCOMPLISHED	\N	\N	\N	2026-03-24 15:09:36.084	2026-03-24 15:09:36.847
e5e09a33-ad68-475c-8a86-ea8a0f7d5800	https://akademi.itu.edu.tr/	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.805	2026-03-24 15:09:36.919
e50c3f9d-e15d-49fe-83c1-bf38d32f9e74	https://dergipark.org.tr/en/	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.131	2026-03-24 15:09:52.198
7cfd736e-814c-4cad-9736-ff9749b53ab5	http://akademi.itu.edu.tr/sahinyu/Patentler	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.834	2026-03-24 15:09:37.328
c3a9a7ca-59be-4f95-ace2-8b05dbcc6980	http://akademi.itu.edu.tr/sahinyu/Tezler	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.836	2026-03-24 15:09:37.398
83090029-bdb4-482e-8cbb-08be46467343	http://akademi.itu.edu.tr/sahinyu/Yay%C4%B1nlar	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.812	2026-03-24 15:09:37.406
0605b2f8-9815-45bb-9e31-363f4e567859	https://dergipark.org.tr/en/pub/page/about	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.14	2026-03-24 15:09:52.27
e74f3511-d2d1-458c-bb35-85aac2c0e24f	https://www.linkedin.com/in/yusuf-h-şahin-b1750b2a5/	1	ERROR	HTTP Error: 999	\N	\N	2026-03-24 15:09:42.808	2026-03-24 15:09:43.979
15daa790-09de-4262-80ce-75a2e6b0ce75	http://akademi.itu.edu.tr/sahinyu/Yusuf-H%C3%BCseyin-%C5%9Eahin	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.81	2026-03-24 15:09:37.399
8ebb5f3c-0ab5-4ca8-bba7-62d8d7eb25ff	http://akademi.itu.edu.tr/sahinyu/Projeler	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.832	2026-03-24 15:09:37.399
dfd57302-43cd-447c-a9ea-13359d453a54	http://akademi.itu.edu.tr/sahinyu/Dersler	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.843	2026-03-24 15:09:37.75
71f75ce7-9380-43ad-8744-c13e73b762b4	http://akademi.itu.edu.tr/sahinyu/Sss	0	ACCOMPLISHED	\N	https://akademi.itu.edu.tr/sahinyu/	e3ab37e3-df70-4dd7-a585-4b94e714b098	2026-03-24 15:09:36.845	2026-03-24 15:09:37.751
dafee960-9d8a-46b9-86e9-1486df81be7e	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=12	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.209	2026-03-24 15:09:53.341
466ebb89-7657-49ff-bc85-bc3f3bc0dd94	https://dergipark.org.tr/en/journal-wizard	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.211	2026-03-24 15:09:53.428
e38a52ac-4939-4223-a4d3-9c02aa8636e6	https://dergipark.org.tr/en/pub/subjects	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.155	2026-03-24 15:09:52.626
65833d2d-0d10-447a-9a9a-d2dc33f2518e	https://dergipark.org.tr/en/pub/page/doi-hizmeti	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.15	2026-03-24 15:09:52.267
fe76f925-2d63-4934-b473-f8bb282c18a5	https://dergipark.org.tr/en/search?section=user	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.21	2026-03-24 15:09:53.391
57e4772a-de41-45ec-9239-ae4fe098646f	https://dergipark.org.tr/en/pub/trends	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.145	2026-03-24 15:09:52.294
2912a493-46c4-4814-862e-b0a43bf222f6	https://dergipark.org.tr/en/user/notification	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.135	2026-03-24 15:09:52.794
cece06e5-21cc-4b28-9b9c-151279db34de	https://dergipark.org.tr/en/search?section=publisher	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.197	2026-03-24 15:09:52.817
ea20a742-20fa-4fa5-8df1-b447ef93d0e3	https://dergipark.org.tr/en/search?section=journal	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.195	2026-03-24 15:09:52.826
4e969a23-072d-4472-96e5-3c477fd47e13	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=19	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.208	2026-03-24 15:09:53.314
1d1f707e-7487-46a0-ad04-4f1e3617d1ba	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=7	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.2	2026-03-24 15:09:52.973
0223fbe7-f304-4b8d-a66d-33a9c3c6d327	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=9	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.203	2026-03-24 15:09:53.067
9a9b9de9-6849-4d75-b626-a2dba6a29ed4	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=8	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.201	2026-03-24 15:09:53.085
c360fd75-48e8-4614-a0da-3261d3c43ab3	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=11	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.204	2026-03-24 15:09:53.149
965e5ee7-cfbb-473b-a76a-3f47cdf97292	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=18	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.207	2026-03-24 15:09:53.176
0b0d163f-c88d-41a4-89b3-e08b3d072c0a	https://dergipark.org.tr/en/pub/announcement	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.212	2026-03-24 15:09:53.204
981f9bff-fd11-4327-89f3-865e9e958095	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	1	ACCOMPLISHED	\N	\N	\N	2026-03-24 15:09:56.356	2026-03-24 15:09:57.479
a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	https://dergipark.org.tr/en/pub/@sahinyu	1	ACCOMPLISHED	\N	\N	\N	2026-03-24 15:09:51.976	2026-03-24 15:09:52.213
98fe2613-25a1-43f2-bf7e-7af9912629fa	https://scholar.google.com.tr/citations?user=GL5yzjYAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.465	2026-03-24 15:09:58.764
b513c4fe-b082-4dfb-b731-6f1f4676afa1	https://scholar.google.com.tr/citations?user=8duwQmoAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.474	2026-03-24 15:09:59.427
4b5c6b86-74bd-4128-aa68-4c33ccc09775	https://scholar.google.com.tr/citations?view_op=list_mandates&hl=tr&oe=Latin5&user=62rdgoYAAAAJ	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.461	2026-03-24 15:09:58.405
9a4aa56f-c1cf-49bd-99c0-4efe7e7a7bac	https://scholar.google.com.tr/scholar?scilib=1&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.447	2026-03-24 15:09:57.851
907237df-6e51-4eea-b50f-40ced02213d2	https://scholar.google.com.tr/citations?user=UDZxnUwAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.467	2026-03-24 15:09:58.77
54bea234-674f-4692-94aa-3ecc2d2967e2	https://scholar.google.com.tr/citations?view_op=view_org&hl=tr&oe=Latin5&org=14760346591542189634	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.475	2026-03-24 15:10:00.029
dfeb4b93-0f92-4684-a389-211261105cec	https://scholar.google.com.tr/scholar_settings?hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.46	2026-03-24 15:09:58.401
d512848d-abf3-4ecc-a095-5a53b1158b2a	https://scholar.google.com.tr/citations?user=aa8JahoAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.473	2026-03-24 15:09:59.103
ffc4baff-b90d-467a-a656-dabfbb2ca6fc	https://scholar.google.com.tr/citations?view_op=metrics_intro&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.451	2026-03-24 15:09:58.451
88b56991-3f50-46ed-ab51-137ae0cb2837	https://scholar.google.com.tr/scholar_alerts?view_op=list_alerts&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.456	2026-03-24 15:09:58.679
5f77294a-0d55-4939-a508-694ccddf02d2	https://scholar.google.com.tr/citations?user=soanB6MAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.463	2026-03-24 15:09:59.394
59281214-6161-42a1-a969-0481ea303659	https://scholar.google.com.tr/citations?view_op=search_authors&hl=tr&oe=Latin5&mauthors=label:computer_vision	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.476	2026-03-24 15:09:59.566
60a2519b-ffb1-4122-bcaf-573762a707d8	https://scholar.google.com.tr/citations?user=uxs3cYcAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.469	2026-03-24 15:09:58.796
d0ed0a5c-ce60-468b-a9e8-30d50ab00a8b	https://scholar.google.com.tr/citations?user=Lzxk0PMAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.471	2026-03-24 15:09:59.047
f7ff42fb-71cc-4fca-9142-360dc912cedc	https://research.itu.edu.tr/en/persons/sahinyu/	0	ACCOMPLISHED	\N	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.697	2026-03-24 15:10:02.25
87382ed4-229d-45b8-a64b-452e631f2912	https://scholar.google.com.tr/citations?user=dukyqPkAAAAJ&hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.472	2026-03-24 15:09:59.397
42ad43c6-7d0a-425d-9298-06fa9d7a979f	https://scholar.google.com.tr/citations?hl=tr&oe=Latin5&user=62rdgoYAAAAJ&view_op=list_works&sortby=title	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.478	2026-03-24 15:09:59.644
5a879eeb-4392-43ba-bbd9-0ff2bd2c16d4	https://scholar.google.com.tr/citations?hl=tr&oe=Latin5&user=62rdgoYAAAAJ&view_op=list_works	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.478	2026-03-24 15:09:59.786
74b87082-f298-48e1-9598-44982c9de149	https://scholar.google.com.tr/citations?view_op=search_authors&hl=tr&oe=Latin5&mauthors=label:deep_learning	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.477	2026-03-24 15:09:59.95
3fac7e58-8ce8-475d-b991-be6b4c46f29b	https://dergipark.org.tr/en/search?section=publisher&filter%5BpublisherType.id%5D%5B0%5D=6	0	ACCOMPLISHED	\N	https://dergipark.org.tr/en/pub/@sahinyu	a61cbb19-14d4-4a88-a877-5e7ec0bd09ac	2026-03-24 15:09:52.199	2026-03-24 15:09:52.846
d6154b15-c6f8-4bf9-bead-3f2dd9dabf92	https://scholar.google.com.tr/schhp?hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.441	2026-03-24 15:09:57.801
e0248b35-34c4-46cd-b071-c681d2e0146f	https://scholar.google.com.tr/citations?hl=tr&oe=Latin5	0	ACCOMPLISHED	\N	https://scholar.google.com.tr/citations?user=62rdgoYAAAAJ&hl=tr	981f9bff-fd11-4327-89f3-865e9e958095	2026-03-24 15:09:57.444	2026-03-24 15:09:58.369
2a72218d-1939-4a7b-a55c-d0d059b8b11e	https://research.itu.edu.tr/tr/persons/sahinyu/publications/?type=%2Fdk%2Fatira%2Fpure%2Fresearchoutput%2Fresearchoutputtypes%2Fcontributiontobookanthology%2Fconference	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.723	2026-03-24 15:10:02.318
415d6738-57c0-4e9f-a647-c544457ea44e	https://research.itu.edu.tr/tr/studentTheses/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.709	2026-03-24 15:10:01.789
1f841ed8-b703-475d-ba33-2e35e3be9154	https://research.itu.edu.tr/tr/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.695	2026-03-24 15:10:01.711
b96e0ae5-a560-4031-b288-321ef7bbd626	https://research.itu.edu.tr/tr/prizes/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.707	2026-03-24 15:10:01.797
1f5de25e-ef06-4582-890f-1a6a3f0d25b9	https://research.itu.edu.tr/tr/persons/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.699	2026-03-24 15:10:01.743
fc4792d0-9d18-4d9a-8aa7-50378b741a92	https://research.itu.edu.tr/tr/persons/sahinyu/network/	0	ACCOMPLISHED	\N	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.719	2026-03-24 15:10:02.302
b2c960a5-1236-4114-9351-455cb7d11ce5	https://research.itu.edu.tr/tr/organisations/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.702	2026-03-24 15:10:01.749
ac9ce827-acfa-4208-8b0c-4cf675fc7f53	https://research.itu.edu.tr/tr/persons/sahinyu/publications/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.72	2026-03-24 15:10:02.303
184da3e6-6acb-4718-9612-bcab6f590f4f	https://research.itu.edu.tr/tr/projects/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.704	2026-03-24 15:10:01.751
1bf70251-9f45-4aeb-abcb-0b9754deea0d	https://research.itu.edu.tr/tr/publications/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.706	2026-03-24 15:10:01.762
d0b297ca-25f4-4341-916d-b07d9b587bc4	https://research.itu.edu.tr/tr/persons/sahinyu/fingerprints/	0	ACCOMPLISHED	\N	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.717	2026-03-24 15:10:02.38
b7559b23-8af4-4476-92b6-2b69bcc3e63d	https://research.itu.edu.tr/tr/persons/sahinyu/publications/?type=%2Fdk%2Fatira%2Fpure%2Fresearchoutput%2Fresearchoutputtypes%2Fcontributiontojournal%2Farticle	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.724	2026-03-24 15:10:02.355
71dbacb2-bd7c-4018-b34e-f354ecf125c4	https://research.itu.edu.tr/tr/organisations/department-of-computer-engineering/	0	ACCOMPLISHED	\N	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.715	2026-03-24 15:10:02.3
724a6a42-6e21-49ca-9840-ee402b658769	https://research.itu.edu.tr/tr/organisations/istanbul-technical-university/	0	ACCOMPLISHED	\N	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.71	2026-03-24 15:10:02.53
42657b4e-1034-4351-b9cc-5d0679b29844	https://research.itu.edu.tr/tr/persons/sahinyu/projects/	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.721	2026-03-24 15:10:02.315
3b347619-4147-46ce-ad81-a605fe155976	https://research.itu.edu.tr/tr/persons/sahinyu/similar/	0	ACCOMPLISHED	\N	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.722	2026-03-24 15:10:02.852
5c7a11ba-cd2f-4514-a23c-3995e8f91325	https://research.itu.edu.tr/tr/persons/sahinyu/publications/?type=%2Fdk%2Fatira%2Fpure%2Fresearchoutput%2Fresearchoutputtypes%2Fcontributiontojournal%2Fconferencearticle	0	ERROR	HTTP Error: 403	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.725	2026-03-24 15:10:02.366
9b863a17-fbad-4233-943f-a85b5bda656c	https://research.itu.edu.tr/tr/publications/how-do-football-teams-play-a-deep-embedded-clustering-approach-to/	0	ACCOMPLISHED	\N	https://research.itu.edu.tr/tr/persons/sahinyu/	cfe6582b-2431-4c7b-93de-477499a6f84c	2026-03-24 15:10:01.726	2026-03-24 15:10:02.912
cfe6582b-2431-4c7b-93de-477499a6f84c	https://research.itu.edu.tr/tr/persons/sahinyu/	1	ACCOMPLISHED	\N	\N	\N	2026-03-24 15:10:01.087	2026-03-24 15:10:01.726
152ad4d4-e3f2-4537-a4c4-5644eeecfb19	https://www.itu.edu.tr/en/homepage	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.521	2026-03-24 15:10:58.782
0c5628a7-589c-4bb5-a2e0-9a097e70c71a	https://www.researchgate.net/scientific-contributions/Yusuf-Huseyin-Sahin-2237095535	1	ERROR	HTTP Error: 403	\N	\N	2026-03-24 15:10:05.93	2026-03-24 15:10:05.975
b42a8420-0930-4937-86b9-ce72e833c09f	https://www.itu.edu.tr/e%C4%9Fitim	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.528	2026-03-24 15:10:58.786
f502f603-0337-4a4d-92e8-713ec1ef16d9	https://www.itu.edu.tr/fakulte-listesi	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.531	2026-03-24 15:10:58.816
d082be3d-aaa7-4d52-8fba-d747c98b4958	https://www.itu.edu.tr	1	ACCOMPLISHED	\N	\N	\N	2026-03-24 15:10:58.341	2026-03-24 15:10:58.537
735968fe-52ea-4d10-a91d-89b4811b2e94	https://www.itu.edu.tr/iletisim	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.505	2026-03-24 15:10:58.611
3d955c35-39aa-498a-a6ef-16efd4f37470	https://www.itu.edu.tr/en	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.507	2026-03-24 15:10:58.646
67b91e8f-22ff-4731-8d76-6d09838e8457	https://www.itu.edu.tr/	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.517	2026-03-24 15:10:58.648
450b0a4d-aa86-4604-af64-fb4efe7165d2	https://www.itu.edu.tr/egitim	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.535	2026-03-24 15:10:58.905
e722d4e7-32ca-48f4-bf40-90ddcec9ccf2	https://www.itu.edu.tr/kampuste-yasam	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.529	2026-03-24 15:10:58.712
abc4227f-e604-497e-84a6-5ffebb2471ba	https://www.itu.edu.tr/duyurular	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.503	2026-03-24 15:10:58.777
f70755e5-e609-4673-af06-aad4d71381ee	https://www.itu.edu.tr/hakkimizda	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.526	2026-03-24 15:10:58.781
839fcd14-a1cf-4593-93d0-bf251635bf1e	https://www.itu.edu.tr/tum-bolumler	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.532	2026-03-24 15:10:58.907
a180f916-a5da-4afc-bc17-ae9df053cba5	https://www.itu.edu.tr/arastirma-merkezleri	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.534	2026-03-24 15:10:58.929
54b3865b-ce5a-4b97-acb1-cfe26a25cdac	https://www.itu.edu.tr/enstitu-listesi	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.531	2026-03-24 15:10:58.931
89302a6c-15a1-424d-b1c8-f5828642233c	https://www.itu.edu.tr/egitim-programlari	0	ACCOMPLISHED	\N	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.533	2026-03-24 15:10:58.931
a2a70115-c271-49f9-a9ad-811b49a5dac4	https://www.itu.edu.tr/images/librariesprovider2/harita/itu_map_tr.jpg	0	ERROR	Not an HTML page	https://www.itu.edu.tr	d082be3d-aaa7-4d52-8fba-d747c98b4958	2026-03-24 15:10:58.536	2026-03-24 15:10:58.958
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Document" (id, url, title, description, keywords, "textContent", "indexedAt") FROM stdin;
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Setting" (id, key, value) FROM stdin;
626269a2-282e-4abc-9462-ac8e3b4fcca8	projectName	Focus Engine for YHŞ
f6e4be27-cd7e-47de-9921-4aab8e12aa96	companyLogo	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6_x2ZRqCVV8CkDna9OXrHqELsYYEDSFTLoA&s
1dbb7456-49c1-4f63-93bb-0e9a37ca773b	pinnedWebsites	https://www.itu.edu.tr , https://akademi.itu.edu.tr/PublicPhoto/dd3deaa8-139d-4950-adcf-9b0dbb757b8f.jpg , 
6c1d20cd-ac8c-4528-96f1-08e5669a3e45	crawlerSelection	meilisearch
\.


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: CrawlJob CrawlJob_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CrawlJob"
    ADD CONSTRAINT "CrawlJob_pkey" PRIMARY KEY (id);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (id);


--
-- Name: Admin_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Admin_username_key" ON public."Admin" USING btree (username);


--
-- Name: Document_url_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Document_url_key" ON public."Document" USING btree (url);


--
-- Name: Setting_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Setting_key_key" ON public."Setting" USING btree (key);


--
-- Name: CrawlJob CrawlJob_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CrawlJob"
    ADD CONSTRAINT "CrawlJob_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."CrawlJob"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict RThs317OwdlfQmjE5cTjzy6BNfVVJfRmx541T3cJBTDRDjPmSnxU7r8heINH7Tr

