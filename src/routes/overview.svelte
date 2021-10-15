<script context="module">
    export async function preload({ params }, { token }) {
        if(!token){
            this.redirect(302, `/login`);
        }
    }
</script>
<script>
    import {post} from 'utils.js';

    async function getMyData(){
        return await post(`auth/getMyData`).then(r=>{
            r.funds = r.accounts.reduce((funds, account ) => funds + account.balance, 0)
            return r
        })
    }
    async function getTransactions(){
        return await post(`auth/getTransactions`)
    }
</script>
{#if process.browser}
    {#await getMyData()}
        Loading...
    {:then my}
        <section>
            <p style="font-size: xx-large">{my.name}</p>
        </section>
        <section>
            My funds
            <p style="font-size: xx-large">{my.funds}</p>
        </section>
        <section>
            <ul>
                {#each my.accounts as account}
                    <li>{account.number} ({account.name})</li>
                {/each}
            </ul>
        </section>
        <section>
            {#await getTransactions()}
                Loading...
            {:then transactions}
                <table class="table table-striped table-bordered ">
                    <thead>
                    <tr>
                        <th>senderName</th>
                        <th>amount</th>
                        <th>createdAt</th>
                        <th>status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each transactions as transaction}
                    <tr>
                        <td><b>{transaction.senderName}</b><br>{transaction.explanation}</td>
                        <td style="color: {transaction.amount >= 0 ? 'green' : 'red'}">{transaction.currency}</td>
                        <td>{transaction.createdAt}</td>
                        <td><b>{transaction.status}</b><br>{transaction.statusDetail}</td>
                    </tr>
                        {/each}
                    </tbody>
                </table>
                <pre>{JSON.stringify(transactions, null, 4)}</pre>
            {/await}
        </section>
        <!--<pre>{JSON.stringify(my, null, 4)}</pre>  Выводит данные JSON-->
    {/await}
{/if}