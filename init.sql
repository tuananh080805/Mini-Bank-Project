create extension if not exists pgcrypto;

create sequence account_number_seq
start 1000000000
increment 1
minvalue 1000000000
maxvalue 9999999999
no cycle;

create sequence transaction_ref_seq
start 1
increment 1;    

create type transactions_type as enum ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER');
create type transactions_status as enum ('PENDING','SUCCESS','FAILED');

create table users(
    id UUID primary key default gen_random_uuid(),
    email varchar(255) unique not null,
    password_hash varchar(255) not null,
    pin_hash varchar(255),
    is_verified boolean default false,
    failed_pin_attempts int default 0,
    is_pin_locked boolean default false,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);

create table bank_accounts(
    id UUID primary key default gen_random_uuid(),
    user_id UUID unique not null,
    account_number bigint unique not null default nextval('account_number_seq'),
    balance decimal(15,2) default 0.0 check(balance >= 0),
    foreign key (user_id) references users(id)
);

create table transactions(
    id UUID primary key default gen_random_uuid(),
    reference_number bigint unique not null default nextval('transaction_ref_seq'),
    from_account_id UUID references bank_accounts(id),
    to_account_id UUID references bank_accounts(id),
    amount decimal(15,2) not null check(amount > 0),
    type transactions_type not null,
    status transactions_status not null,
    description varchar(255),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    constraint check_trans check (
        (type = 'DEPOSIT'
            and to_account_id is not null
            and from_account_id is null)
        or
        (type = 'WITHDRAWAL'
            and from_account_id is not null
            and to_account_id is null)
        or
        (type = 'TRANSFER'
            and from_account_id is not null
            and to_account_id is not null
            and from_account_id <> to_account_id)
    )
);
create table email_verifications(
    id UUID primary key default gen_random_uuid(),
    user_id UUID not null,
    token varchar(64) unique not null,
    expires_at timestamp not null,
    used boolean default false,
    created_at timestamp default current_timestamp,
    foreign key (user_id) references users(id) on delete cascade
);

create index idx_email_verifications_token on email_verifications(token);
create index idx_transactions_from_account on transactions(from_account_id);
create index idx_transactions_to_account on transactions(to_account_id);
create index idx_transactions_status on transactions(status);
create index idx_bank_accounts on bank_accounts(account_number);