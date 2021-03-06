<!DOCTYPE html>
<html style="background-color:lavender;">

<head>
    <meta charset="utf-8">
    <title>Project report</title>
</head>

<body prefix="schema: http://schema.org">
    <header>
        <h1>
            E-card Web Editor raport
        </h1>
        <div role="contentinfo">
            <section typeof="sa:AuthorsList">
                <h3>Autori</h3>
                <ul>
                    <li typeof="sa:ContributorRole" property="schema:author">
                        <span typeof="schema:Person">
                            <meta property="schema:givenName" content="Marius">
                            <meta property="schema:additionalName" content="Marian">
                            <meta property="schema:familyName" content="Blaj">
                            <span property="schema:name">Marius M. Blaj</span>
                        </span>
                        <ul>
                            <li property="schema:roleContactPoint" typeof="schema:ContactPoint">
                                <a href="mailto:marius.blaj@info.uaic.ro" property="schema:email">marius.blaj@info.uaic.ro</a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul>
                    <li typeof="sa:ContributorRole" property="schema:author">
                        <span typeof="schema:Person">
                            <meta property="schema:givenName" content="Lavinia">
                            <meta property="schema:familyName" content="Disca">
                            <span property="schema:name">Lavinia Disca</span>
                        </span>
                        <ul>
                            <li property="schema:roleContactPoint" typeof="schema:ContactPoint">
                                <a href="mailto:lavinia.disca@info.uaic.ro" property="schema:email">lavinia.disca@info.uaic.ro</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>
        </div>
    </header>
    <section typeof="sa:Abstract" id="abstract" role="doc-abstract">
        <h3>Introducere</h3>
        <p>
            E-card Web Editor(ECaW) este o aplicatie web extensibila pentru crearea digitala a unor ilustrate de diverse categorii si impartasirea acestora cu cei dragi. Utilizatorii vor avea la dispozitie un canvas unde vor putea crea cardul dorit.
        </p>
    </section>
    <section id="techs">
        <h3>Tehnologii utilizate</h3>
        <ul>
            <li>JavaScript pentru implementarea functionalitatilor</li>
            <li>HTML si CSS pentru vizualizarea paginilor,respectiv pentru stilizarea lor</li>
            <li>MongoDB pentru managementul bazei de date</li>
            <li>Node.js pentru implementarea serverului</li>
        </ul>
    </section>
    <section id="pages">
        <h3>Paginile Web</h3>
        <ul>
            <li>
                <b>Login</b>: Utilizatorii se vor putea loga cu contul de ECaW. Login-ul este necesar pentru a putea modifica proiectele personale.
            </li>
            <li>
                <b>Register</b>: In cazul in care utilizatorul nu are cont pe platforma, acesta isi va putea crea unul pe aceasta pagina.
            </li>
            <li>
                <b>Projects</b>: Aici utilizatorul va putea vedea lista proiectelor la care are acces, sau sa creeze un nou proiect. Va putea vedea continutul fiecarui proiect pentru a-l edita.
            </li>
            <li>
                <b>Home</b>: Pe aceasta pagina utilizatorul isi va putea da frau liber imaginatiei. Aici va putea sa isi creeze cardul pe care il doreste.
            </li>
        </ul>
    </section>
    <section id="tools">
        <h3>Instrumente disponibile</h3>
        <ul>
            <li>
                <b>Line</b>: Deseneaza linii pe canvas.
            </li>
            <li>
                <b>Text</b>: Inseareaza text.
            </li>
            <li>
                <b>Rectangle</b>: Creeaza un dreptunghi.
            </li>
            <li>
                <b>Ellipse</b>: Creeaza o elipsa.
            </li>
            <li>
                <b>Circle</b>: Creeaza un cerc.
            </li>
            <li>
                <b>Photo</b>: Inseareaza poze de pe dispozitivul local sau de pe API-ul de la Imgur.
            </li>
            <li>
                <b>Resize/Move</b>: Ajusteaza marimea oricarui obiect desenat.
            </li>
            <li>
                <b>Flood fill</b>: Umple o suprafata cu o culoare.
            </li>
            <li>
                <b>Save Project</b>: Salveaza proiectul in baza de date.
            </li>
            <li>
                <b>Download</b>: Descarca un png cu cardul.
            </li>
        </ul>
    </section>
    <section id="server">
        <h3>
            Server end points
        </h3>
        <ul>
            <li>
                <b>POST/users/auth</b>: Va verifica credentialele utilizatorului.
            </li>
            <li>
                <b>POST/users/register</b>: Va crea contul utilizatorului.
            </li>
            <li>
                <b>GET/projects</b>: Va trimite proiectele utilizatorului.
            </li>
            <li>
                <b>GET/projects/{id}</b>: Trimite datele proiectului cu id-ul respectiv.
            </li>
            <li>
                <b>POST/projects/{id}</b>: Actualizeaza datele proiectului.
            </li>
            <li>
                <b>DELETE/projects/{id}</b>: Sterge un proiect.
            </li>
            <li>
                <b>POST/projects/empty</b>: Creeaza un proiect gol.
            </li>
            <li>
                <b>GET/projects/photo/{username}/{projectId}/{canvas}</b>: Trimite imaginea userului(username), pentru proiectul cu id-ul projectId, denumita {canvas}.
            </li>
            <li>
                <b>POST/projects/photo/{projectId}</b>: Salveaza o poza pentru proiectul projectId.
            </li>
        </ul>
    </section>
    <section>
        <h3>Arhitectura aplicatiei: MVC</h3>
        <figure typeof="sa:image">
            <img src="MVC.png" alt="MVC Diagram">
        </figure>
        <ul>
            <li><b>View</b>: reprezinta interfata grafica cu care interactioneaza utilizatorul</li>
            <li><b>Controller</b>: interpreteaza inputurile provenite din View</li>
            <li><b>Model</b>: trimite cereri serverului si proceseaza raspunsurile primite</li>
            <li><b>Server</b>: se ocupa de managementul bazei de date si de autentificarea utilizatorilor</li>
        </ul>
    </section>
    <section>
        <h3>Database Diagram</h3>
        <figure typeof="sa:image">
            <img src="dbdiagram.png" alt="Database Diagram">
        </figure>
    </section>
</body>

</html>
